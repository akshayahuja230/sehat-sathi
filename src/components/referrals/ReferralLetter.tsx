"use client";

import { z } from "zod";

export const referralLetterSchema = z.object({
  id: z.string().optional(),
  patient: z.object({
    fullName: z.string().default(""),
    dob: z.string().optional().default(""),
    mrn: z.string().optional().default(""),
    phone: z.string().optional().default(""),
  }),

  to: z.object({
    clinicianName: z.string().optional().default(""),
    clinic: z.string().optional().default(""),
    specialty: z.string().optional().default(""),
    fax: z.string().optional().default(""),
  }),

  from: z.object({
    clinicianName: z.string().optional().default(""),
    clinic: z.string().optional().default(""),
    phone: z.string().optional().default(""),
  }),

  reasonForReferral: z.string().default(""),
  urgency: z.enum(["routine", "urgent", "stat"]).default("routine"),

  // Structured content (reliable + machine-friendly)
  history: z.array(z.string()).default([]),
  relevantPMH: z.array(z.string()).default([]),
  meds: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  examFindings: z.array(z.string()).default([]),
  assessment: z.array(z.string()).default([]),
  requestedWorkup: z.array(z.string()).default([]),

  // Human-friendly final output
  letterMarkdown: z.string().default(""),
});

export type ReferralLetterProps = z.infer<typeof referralLetterSchema>;

function Section({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (!items?.length) return null;
  return (
    <div>
      <div className="text-xs font-medium text-gray-500">{title}</div>
      <ul className="mt-1 list-disc pl-5 text-sm text-gray-900">
        {items.map((x, i) => (
          <li key={`${title}-${i}`}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

export function ReferralLetter(props: ReferralLetterProps) {
  const { patient, to, from, urgency, reasonForReferral, letterMarkdown } = props;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">Referral Letter</h3>
        <p className="text-sm text-gray-500">
          {patient.fullName || "Patient"} • Urgency: {urgency}
        </p>
        {to.specialty || to.clinic ? (
          <p className="text-xs text-gray-500 mt-1">
            To: {to.specialty || "—"} {to.clinic ? `• ${to.clinic}` : ""}
          </p>
        ) : null}
      </div>

      <div className="p-4 space-y-4">
        {reasonForReferral ? (
          <div>
            <div className="text-xs font-medium text-gray-500">Reason for referral</div>
            <div className="text-sm text-gray-900 mt-1">{reasonForReferral}</div>
          </div>
        ) : null}

        {/* Structured sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Section title="History" items={props.history} />
          <Section title="Relevant PMH" items={props.relevantPMH} />
          <Section title="Medications" items={props.meds} />
          <Section title="Allergies" items={props.allergies} />
          <Section title="Exam / Findings" items={props.examFindings} />
          <Section title="Assessment" items={props.assessment} />
          <Section title="Requested workup / consult request" items={props.requestedWorkup} />
        </div>

        {/* Final letter body */}
        <div>
          <div className="text-xs font-medium text-gray-500 mb-2">Copy-ready letter</div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans">
              {letterMarkdown || "No letter generated yet."}
            </pre>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            <button
              type="button"
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => navigator.clipboard.writeText(letterMarkdown || "")}
            >
              Copy
            </button>

            <a
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 inline-block"
              href={`https://wa.me/?text=${encodeURIComponent(letterMarkdown || "")}`}
              target="_blank"
              rel="noreferrer"
            >
              Share WhatsApp
            </a>

            <button
              type="button"
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => window.print()}
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}