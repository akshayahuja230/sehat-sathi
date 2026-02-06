// Pure storage layer. No UI. No tambo. No imports.

export type StoredTriageOutcome = {
  outcome: "emergency" | "urgent" | "routine";
  symptoms: string[];
  bodyAreas: string[];
  timestamp: number;
};

const KEY = "community_health_events";

export function saveOutcome(event: StoredTriageOutcome) {
  const existing = loadOutcomes();
  existing.push(event);
  localStorage.setItem(KEY, JSON.stringify(existing));

  window.dispatchEvent(new Event("community-health-updated"));
}

export function loadOutcomes(): StoredTriageOutcome[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

if (typeof window !== "undefined") {
  const existing = localStorage.getItem("community_health_events");
  if (!existing) {
    localStorage.setItem(
      "community_health_events",
      JSON.stringify([
        {
          outcome: "urgent",
          symptoms: ["fever"],
          bodyAreas: ["chest"],
          timestamp: Date.now()
        }
      ])
    );
  }
}

