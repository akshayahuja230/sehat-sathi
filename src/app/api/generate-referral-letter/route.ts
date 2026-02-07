import { NextResponse } from "next/server";

function asStringArray(v: any): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map((x) => String(x)).filter(Boolean);
  return [];
}

export async function POST(req: Request) {
  const { triage, toSpecialty, urgency, clinicOrDoctor, reason } =
    await req.json();

  const triageObj = triage && typeof triage === "object" ? triage : {};
  const raw = typeof triageObj.raw === "string" ? triageObj.raw : "";

  // ✅ Try multiple field names (in case your triage JSON uses different keys)
  const symptoms: string[] = asStringArray(
    triageObj.symptoms ?? triageObj.selectedSymptoms
  );

  const bodyAreas: string[] = asStringArray(
    triageObj.bodyAreas ?? triageObj.selectedBodyAreas
  );

  const dangerSigns: string[] = asStringArray(
    triageObj.dangerSigns ?? triageObj.redFlags
  );

  const durationDays: number | null =
    typeof triageObj.durationDays === "number"
      ? triageObj.durationDays
      : typeof triageObj.duration === "number"
        ? triageObj.duration
        : typeof triageObj.days === "number"
          ? triageObj.days
          : null;

  // 1) Safety: if triage shows emergency danger signs, force urgency
  const emergencyLike = dangerSigns.some((x) =>
    ["trouble breathing", "severe bleeding", "fainting", "chest pain"].includes(
      String(x).toLowerCase()
    )
  );

  const finalUrgency: "routine" | "urgent" | "stat" =
    emergencyLike ? "stat" : urgency;

  const reasonText =
    reason ||
    `Evaluation of ${symptoms.join(", ") || "symptoms"}${
      durationDays ? ` for ${durationDays} days` : ""
    }`;

  const toClinic = clinicOrDoctor || "";

  // ✅ If structured fields are empty, still include the raw triage text so your letter isn't blank
  const rawFallbackLine =
    !symptoms.length && !bodyAreas.length && !durationDays && !dangerSigns.length && raw
      ? `- Triage summary: ${raw.replace(/\s+/g, " ").trim().slice(0, 600)}${
          raw.length > 600 ? "..." : ""
        }`
      : "";

  const letterMarkdown = `**To:** ${toSpecialty}${toClinic ? `, ${toClinic}` : ""}

**Re:** Referral for evaluation — ${reasonText}  
**Urgency:** ${finalUrgency.toUpperCase()}

Dear Doctor,

I am referring this patient for evaluation of **${reasonText}**.

**Summary / Triage details**
- Symptoms: ${symptoms.length ? symptoms.join(", ") : "—"}
- Body areas: ${bodyAreas.length ? bodyAreas.join(", ") : "—"}
- Duration: ${durationDays ? `${durationDays} days` : "—"}
- Danger signs: ${dangerSigns.length ? dangerSigns.join(", ") : "None reported"}
${rawFallbackLine}

**Request**
- Please assess and advise further investigations and management.

Thank you,  
[Clinician/Health Worker Name]
`;

  return NextResponse.json({
    patient: { fullName: "", dob: "", mrn: "", phone: "" },
    to: {
      clinicianName: "",
      clinic: toClinic,
      specialty: toSpecialty,
      fax: "",
    },
    from: { clinicianName: "", clinic: "", phone: "" },
    reasonForReferral: reasonText,
    urgency: finalUrgency,
    history: [
      symptoms.length ? `Symptoms: ${symptoms.join(", ")}` : "Symptoms: —",
      durationDays ? `Duration: ${durationDays} days` : "Duration: —",
      dangerSigns.length
        ? `Danger signs: ${dangerSigns.join(", ")}`
        : "Danger signs: none reported",
      raw ? `Triage raw: ${raw.replace(/\s+/g, " ").trim().slice(0, 300)}${raw.length > 300 ? "..." : ""}` : "",
    ].filter(Boolean),
    relevantPMH: [],
    meds: [],
    allergies: [],
    examFindings: [],
    assessment: emergencyLike
      ? ["Danger signs present—please evaluate urgently."]
      : ["Needs specialist evaluation based on triage presentation."],
    requestedWorkup: ["Clinical evaluation and appropriate investigations as indicated."],
    letterMarkdown,
  });
}