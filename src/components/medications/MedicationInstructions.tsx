"use client";
import { z } from "zod";

export const medicationInstructionsSchema = z.object({
  patientName: z.string().optional(),
  medicationName: z.string().default("Medication"),
  strength: z.string().optional(),
  form: z.enum(["tablet", "capsule", "liquid", "inhaler", "topical"]).optional(),

  dose: z
    .object({
      amount: z.number().default(1),
      unit: z.enum(["tablet", "capsule", "ml", "puff", "apply"]).default("tablet"),
    })
    .default({ amount: 1, unit: "tablet" }),

  schedule: z
    .object({
      morning: z.boolean().default(false),
      noon: z.boolean().default(false),
      evening: z.boolean().default(false),
      bedtime: z.boolean().default(false),
      frequencyText: z.string().optional(),
    })
    .default({ morning: false, noon: false, evening: false, bedtime: false }),

  durationDays: z.number().optional(),
  withFood: z.enum(["with_food", "no_food_requirement", "empty_stomach"]).optional(),
  warnings: z.array(z.string()).default([]),
  notesSimple: z.array(z.string()).default([]),
  language: z.enum(["en", "es", "fr", "de"]).default("en"),
});

export type MedicationInstructionsProps = z.infer<typeof medicationInstructionsSchema>;

function PillDots({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: Math.max(0, Math.min(count, 6)) }).map((_, i) => (
        <span key={i} className="inline-block w-3 h-3 rounded-full bg-slate-900" />
      ))}
      {count > 6 && <span className="text-xs text-slate-600">x{count}</span>}
    </div>
  );
}

export function MedicationInstructions(props: MedicationInstructionsProps) {
  const dose = props.dose ?? { amount: 1, unit: "tablet" as const };
  const schedule = props.schedule ?? {
    morning: false,
    noon: false,
    evening: false,
    bedtime: false,
  };
  const { medicationName, strength, durationDays} = props;
  const notesSimple = props.notesSimple ?? [];
  const warnings = props.warnings ?? [];
  const times = [
    { key: "morning", label: "Morning" },
    { key: "noon", label: "Noon" },
    { key: "evening", label: "Evening" },
    { key: "bedtime", label: "Bedtime" },
  ] as const;

  return (
    <div className="bg-white border rounded-lg p-4 space-y-3">
      <div>
        <h3 className="text-lg font-semibold">Medication Instructions</h3>
        <div className="text-sm text-slate-700">
          <span className="font-medium">{medicationName}</span>
          {strength ? ` • ${strength}` : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border rounded p-3 bg-slate-50">
        <div>
          <div className="text-sm font-medium">Dose</div>
          <div className="text-sm text-slate-700">
            Take {dose.amount} {dose.unit}
          </div>
        </div>
        <PillDots count={dose.amount} />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">When</div>
        <div className="flex flex-wrap gap-2">
          {times.map((t) => {
            const on = schedule[t.key];
            return (
              <span
                key={t.key}
                className={`px-3 py-1 rounded-full border text-sm ${
                  on ? "bg-green-100 border-green-200 text-green-900" : "bg-white border-slate-200 text-slate-500"
                }`}
              >
                {t.label}
              </span>
            );
          })}
          {schedule.frequencyText ? (
            <span className="px-3 py-1 rounded-full border bg-white text-sm text-slate-700">
              {schedule.frequencyText}
            </span>
          ) : null}
        </div>
      </div>

      {durationDays ? (
        <div className="text-sm">
          <span className="font-medium">Duration:</span> {durationDays} days
        </div>
      ) : null}

      {notesSimple.length > 0 ? (
        <div className="space-y-1">
          <div className="text-sm font-medium">Simple notes</div>
          <ul className="list-disc pl-5 text-sm text-slate-700">
            {notesSimple.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
      ) : null}

      {warnings.length > 0 ? (
        <div className="space-y-1">
          <div className="text-sm font-medium text-amber-900">Warnings</div>
          <ul className="list-disc pl-5 text-sm text-amber-900">
            {warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      ) : null}
    </div>
  );
}