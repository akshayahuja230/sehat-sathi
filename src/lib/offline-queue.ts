/**
 * offline-queue.ts
 *
 * Stores triage outcomes locally when the app is offline.
 * No sync logic lives here.
 */

const STORAGE_KEY = "offline_triage_outcomes";

export function saveOfflineOutcome(event: any) {
  const existing =
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  existing.push(event);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(existing)
  );
}

export function getOfflineOutcomes() {
  return JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );
}
