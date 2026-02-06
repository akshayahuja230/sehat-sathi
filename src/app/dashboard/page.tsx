"use client";

import { loadOutcomes } from "@/lib/community-store";
import { useEffect, useMemo, useState } from "react";

export default function DashboardPage() {
  const [events, setEvents] = useState<ReturnType<typeof loadOutcomes>>([]);

  useEffect(() => {
    setEvents(loadOutcomes());
  }, []);

  const now = Date.now();

  const stats = useMemo(() => {
    const total = events.length;

    const emergency = events.filter(e => e.outcome === "emergency").length;
    const urgent = events.filter(e => e.outcome === "urgent").length;

    const last24h = events.filter(
      e => now - e.timestamp < 24 * 60 * 60 * 1000
    ).length;

    const last7d = events.filter(
      e => now - e.timestamp < 7 * 24 * 60 * 60 * 1000
    ).length;

    return {
      total,
      emergency,
      urgent,
      emergencyPct: total ? Math.round((emergency / total) * 100) : 0,
      urgentPct: total ? Math.round((urgent / total) * 100) : 0,
      last24h,
      last7d,
    };
  }, [events, now]);

  const symptoms = useMemo(
    () => countBy(events.flatMap(e => e.symptoms)),
    [events]
  );

  const bodyAreas = useMemo(
    () => countBy(events.flatMap(e => e.bodyAreas)),
    [events]
  );

  const recent = [...events]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto p-10 space-y-10">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Community Health Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Aggregated, anonymized local triage insights
          </p>
        </div>

        <OfflineBadge />
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Kpi title="Total Cases" value={stats.total} />
        <Kpi
          title="Emergency"
          value={`${stats.emergency} (${stats.emergencyPct}%)`}
          tone="danger"
          hint="Requires immediate attention"
        />
        <Kpi
          title="Urgent"
          value={`${stats.urgent} (${stats.urgentPct}%)`}
          tone="warning"
          hint="Needs timely follow-up"
        />
      </section>

      {/* Time context */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard label="Cases in last 24 hours" value={stats.last24h} />
        <InfoCard label="Cases in last 7 days" value={stats.last7d} />
      </section>

      {/* Insights */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard title="Top Symptoms" data={symptoms} />
        <InsightCard title="Affected Body Areas" data={bodyAreas} />
      </section>

      
    </div>
  );
}

/* ---------------- helpers ---------------- */

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, v) => {
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {});
}

function formatRelativeTime(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} d ago`;
}

/* ---------------- UI ---------------- */

function OfflineBadge() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    setOnline(navigator.onLine);

    const on = () => setOnline(true);
    const off = () => setOnline(false);

    window.addEventListener("online", on);
    window.addEventListener("offline", off);

    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (online === null) return null;

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full ${
        online
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {online ? "Online · Sync ready" : "Offline · Data saved locally"}
    </span>
  );
}

function Kpi({
  title,
  value,
  tone = "neutral",
  hint,
}: {
  title: string;
  value: string | number;
  tone?: "neutral" | "warning" | "danger";
  hint?: string;
}) {
  const color =
    tone === "danger"
      ? "text-red-600"
      : tone === "warning"
      ? "text-amber-600"
      : "text-foreground";

  const bg =
    tone === "danger"
      ? "bg-red-50"
      : tone === "warning"
      ? "bg-amber-50"
      : "bg-background";

  return (
    <div className={`rounded-2xl border p-6 ${bg}`}>
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className={`text-4xl font-semibold mt-2 ${color}`}>
        {value}
      </div>
      {hint && (
        <p className="text-xs text-muted-foreground mt-4">
          {hint}
        </p>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border p-6">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-3xl font-semibold mt-2">{value}</div>
    </div>
  );
}

function InsightCard({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <div className="rounded-2xl border p-6">
      <h2 className="font-medium mb-4">{title}</h2>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data available</p>
      ) : (
        <ul className="space-y-3">
          {entries.map(([key, count]) => (
            <li key={key} className="flex justify-between text-sm">
              <span className="capitalize">{key}</span>
              <span className="font-semibold">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
