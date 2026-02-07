export type TriageLevel = "emergency" | "urgent" | "routine";

export type DecisionOption = {
  id: string;
  labelKey: string;
  nextNodeId?: string;
  outcome?: TriageLevel;
};

export type DecisionNode = {
  id: string;
  questionKey: string;
  options: DecisionOption[];
};

export const TRIAGE_TREE: Record<string, DecisionNode> = {
  start: {
    id: "start",
    questionKey: "dt_q_start",
    options: [
      { id: "a", labelKey: "dt_o_breathing", outcome: "emergency" },
      { id: "b", labelKey: "dt_o_chest_pain", outcome: "emergency" },
      { id: "c", labelKey: "dt_o_bleeding", outcome: "emergency" },
      { id: "d", labelKey: "dt_o_none", nextNodeId: "fever" },
    ],
  },
  fever: {
    id: "fever",
    questionKey: "dt_q_fever",
    options: [
      { id: "a", labelKey: "dt_o_high_fever", nextNodeId: "duration" },
      { id: "b", labelKey: "dt_o_mild_fever", nextNodeId: "duration" },
      { id: "c", labelKey: "dt_o_no", nextNodeId: "pain" },
    ],
  },
  duration: {
    id: "duration",
    questionKey: "dt_q_duration",
    options: [
      { id: "a", labelKey: "dt_o_lt_24h", outcome: "routine" },
      { id: "b", labelKey: "dt_o_1_3d", outcome: "urgent" },
      { id: "c", labelKey: "dt_o_gt_3d", outcome: "urgent" },
    ],
  },
  pain: {
    id: "pain",
    questionKey: "dt_q_pain",
    options: [
      { id: "a", labelKey: "dt_o_yes", outcome: "urgent" },
      { id: "b", labelKey: "dt_o_no2", outcome: "routine" },
    ],
  },
};