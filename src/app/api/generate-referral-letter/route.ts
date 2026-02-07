import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { triage, toSpecialty, urgency, clinicOrDoctor, reason } = await req.json();

  // 1) Safety: if triage shows emergency danger signs, force urgency
  const dangerSigns: string[] = triage?.dangerSigns || [];
  const emergencyLike = dangerSigns.some((x) =>
    ["trouble breathing", "severe bleeding", "fainting", "chest pain"].includes(
      String(x).toLowerCase()
    )
  );

  const finalUrgency: "routine" | "urgent" | "stat" =
    emergencyLike ? "stat" : urgency;

  // 2) TODO: call LLM here with a fixed internal prompt (no user prompt)
  // For now, return a deterministic example built from triage:
  const symptoms = triage?.symptoms || [];
  const bodyAreas = triage?.bodyAreas || [];
  const durationDays = triage?.durationDays;

  const reasonText =
    reason ||
    `Evaluation of ${symptoms.join(", ") || "symptoms"}${
      durationDays ? ` for ${durationDays} days` : ""
    }`;

  const toClinic = clinicOrDoctor || "";

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
      dangerSigns.length ? `Danger signs: ${dangerSigns.join(", ")}` : "Danger signs: none reported",
    ],
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