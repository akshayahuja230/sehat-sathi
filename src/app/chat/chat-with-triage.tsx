"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { TriagePanel } from "@/components/triage/TriagePanel";
import { useTamboThreadInput } from "@tambo-ai/react";
import { useEffect, useMemo, useState } from "react";

export function ChatWithTriage({
  onGenerateReferral,
}: {
  onGenerateReferral: (input: {
    triage: any;
    toSpecialty: string;
    urgency: "routine" | "urgent" | "stat";
    clinicOrDoctor?: string;
    reason?: string;
  }) => Promise<void>;
}) {
  const { setValue, submit, isPending } = useTamboThreadInput();

  // Store the latest triage payload that the user generated in the TriagePanel.
  // We will reuse this for referral generation (no prompt needed).
  const [latestTriageText, setLatestTriageText] = useState<string>("");

  const [showReferralForm, setShowReferralForm] = useState(false);
  const [toSpecialty, setToSpecialty] = useState("General Medicine");
  const [urgency, setUrgency] = useState<"routine" | "urgent" | "stat">("routine");
  const [clinicOrDoctor, setClinicOrDoctor] = useState("");
  const [reason, setReason] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A simple auto-reason based on what triage produced (works even if triage is just a string/JSON).
  const suggestedReason = useMemo(() => {
    if (!latestTriageText) return "";
    // Keep it short so it looks nice in the input.
    const short = latestTriageText.replace(/\s+/g, " ").trim().slice(0, 140);
    return short ? `Evaluation based on triage: ${short}${latestTriageText.length > 140 ? "..." : ""}` : "";
  }, [latestTriageText]);

  // Set a default reason once we have triage text (but don't overwrite user edits)
  useEffect(() => {
    if (!reason && suggestedReason) setReason(suggestedReason);
  }, [suggestedReason, reason]);

  // Also set an initial default if user opens referral before triage
  useEffect(() => {
    if (!reason) setReason("Specialist evaluation requested based on triage findings.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Triage panel on top */}
      <div className="p-4 border-b bg-slate-50">
        <TriagePanel
          onSendToChat={async (text) => {
            // Save the latest triage output so we can generate a referral letter without prompting.
            setLatestTriageText(text);

            // Keep your current behavior: send the triage text into chat to update medication instructions.
            setValue(
              `Based on this triage JSON, update MedicationInstructions id med-instructions : ${text}`
            );

            if (!isPending) {
              await submit({ streamResponse: true });
            }
          }}
        />

        {/* Optional helper text */}
        <p className="text-xs text-slate-500 mt-3">
          Tip: Complete triage above, then use “Generate Referral Letter” below (no prompt needed).
        </p>
      </div>

      {/* Chat thread below */}
      {/* <div className="flex-1 min-h-0">
        <MessageThreadFull />
      </div> */}

      {/* Referral letter generator (no prompt) */}
      <div className="border-t bg-white p-4">
        <div className="rounded-xl border border-gray-200 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-medium">Referral letter</div>
              <div className="text-sm text-gray-500">
                Generate a doctor referral letter from the triage details (no prompt).
              </div>
              {!latestTriageText ? (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2">
                  Please complete triage first (top panel). Then generate the referral letter.
                </div>
              ) : null}
            </div>

            <button
              onClick={() => setShowReferralForm((v) => !v)}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              type="button"
            >
              {showReferralForm ? "Close" : "Generate Referral Letter"}
            </button>
          </div>

          {showReferralForm && (
            <div className="mt-4 space-y-3">
              {error && (
                <div className="text-sm text-red-600 border border-red-200 bg-red-50 rounded-lg p-2">
                  {error}
                </div>
              )}

              <label className="block">
                <div className="text-xs text-gray-500 mb-1">Target specialty</div>
                <select
                  value={toSpecialty}
                  onChange={(e) => setToSpecialty(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                >
                  <option>General Medicine</option>
                  <option>Cardiology</option>
                  <option>Pediatrics</option>
                  <option>OB/GYN</option>
                  <option>Orthopedics</option>
                  <option>ENT</option>
                  <option>Dermatology</option>
                  <option>Psychiatry</option>
                </select>
              </label>

              <div>
                <div className="text-xs text-gray-500 mb-1">Urgency</div>
                <div className="flex gap-2 flex-wrap">
                  {(["routine", "urgent", "stat"] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUrgency(u)}
                      className={[
                        "rounded-lg border px-3 py-2 text-sm",
                        urgency === u ? "bg-black text-white" : "hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {u.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <div className="text-xs text-gray-500 mb-1">
                  Facility / Doctor (optional)
                </div>
                <input
                  value={clinicOrDoctor}
                  onChange={(e) => setClinicOrDoctor(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  placeholder="e.g., Dr. Sharma, District Hospital"
                />
              </label>

              <label className="block">
                <div className="text-xs text-gray-500 mb-1">Reason (editable)</div>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  placeholder="e.g., Evaluation of chest pain for 3 days"
                />
              </label>

              <button
                type="button"
                disabled={isGenerating}
                onClick={async () => {
                  try {
                    setError(null);

                    if (!latestTriageText) {
                      setError("Please complete triage first.");
                      return;
                    }

                    setIsGenerating(true);

                    // ✅ Here is the triage object we send to your API.
                    // You can later improve it by parsing JSON if your triage output is JSON.
                    const triage = {
                      raw: latestTriageText,
                    };

                    await onGenerateReferral({
                      triage,
                      toSpecialty,
                      urgency,
                      clinicOrDoctor,
                      reason,
                    });
                  } catch (e: any) {
                    setError(e?.message || "Failed to generate referral letter");
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                className="w-full rounded-lg bg-black text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}