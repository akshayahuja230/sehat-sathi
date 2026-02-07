import type { TriageLevel } from "./decisionTree";

export type BodyArea =
  | "head"
  | "chest"
  | "abdomen"
  | "back"
  | "arm_left"
  | "arm_right"
  | "leg_left"
  | "leg_right"
  | "none";

export type SymptomInput = {
  language: "en" | "hi" | "mr" | "gu";
  symptomText: string;
  bodyArea: BodyArea;
};

export type TriageResult = {
  level: TriageLevel;
  summary: string;
};

function bodyAreaLabel(area: BodyArea) {
  switch (area) {
    case "head":
      return "Head";
    case "chest":
      return "Chest";
    case "abdomen":
      return "Abdomen";
    case "arm_left":
      return "Left arm";
    case "arm_right":
      return "Right arm";
    case "leg_left":
      return "Left leg";
    case "leg_right":
      return "Right leg";
    default:
      return "Not selected";
  }
}

/**
 * Minimal deterministic “glue”.
 * (Later you can add real red-flag rules + Tambo tool calls.)
 */
export function buildTriageSummary(input: SymptomInput, level: TriageLevel): TriageResult {
  const trimmed = input.symptomText.trim();
  const symptomPart = trimmed ? `"${trimmed}"` : "(no symptom text provided)";
  const areaPart = bodyAreaLabel(input.bodyArea);

  const summary =
    `Symptoms: ${symptomPart}\n` +
    `Body area: ${areaPart}\n` +
    `Triage level: ${level.toUpperCase()}`;

  return { level, summary };
}