"use client";

import type { BodyArea } from "@/services/triage/triageEngine";

function regionClasses(active: boolean) {
  return active
    ? "fill-red-300 stroke-red-600"
    : "fill-slate-200 stroke-slate-500 hover:fill-slate-300";
}

export function BodyDiagram({
  value,
  onChange,
}: {
  value: BodyArea;
  onChange: (area: BodyArea) => void;
}) {
  return (
    <div className="w-full">
      {/* Front/Back toggle-like hint */}
      <div className="text-center text-xs text-slate-600 mb-2">
        Tap a region to select (front + back)
      </div>

      <svg viewBox="0 0 220 420" className="w-full max-w-[320px] mx-auto">
        {/* ========= LEFT: FRONT VIEW ========= */}
        <g transform="translate(0, 0)">
          {/* Head */}
          <circle
            cx="60"
            cy="55"
            r="22"
            className={`${regionClasses(value === "head")} cursor-pointer`}
            strokeWidth="2"
            onClick={() => onChange("head")}
          />

          {/* Chest */}
          <rect
            x="35"
            y="90"
            width="50"
            height="55"
            rx="10"
            className={`${regionClasses(value === "chest")} cursor-pointer`}
            strokeWidth="2"
            onClick={() => onChange("chest")}
          />

          {/* Abdomen */}
          <rect
            x="35"
            y="152"
            width="50"
            height="60"
            rx="10"
            className={`${regionClasses(value === "abdomen")} cursor-pointer`}
            strokeWidth="2"
            onClick={() => onChange("abdomen")}
          />

          {/* Arms */}
          <rect
            x="12"
            y="100"
            width="18"
            height="115"
            rx="10"
            className={`${regionClasses(value === "arm_left")} cursor-pointer`}
            strokeWidth="2"
            onClick={() => onChange("arm_left")}
          />
          <rect
            x="90"
            y="100"
            width="18"
            height="115"
            rx="10"
            className={`${regionClasses(value === "arm_right")} cursor-pointer`}
            strokeWidth="2"
            onClick={() => onChange("arm_right")}
          />

          {/* Legs */}
          <rect
            x="40"
            y="225"
            width="22"
            height="135"
            rx="10"
            className={`${regionClasses(value === "leg_left")} cursor-pointer`}
            strokeWidth="2"
            onClick={() => onChange("leg_left")}
          />
          <rect
            x="63"
            y="225"
            width="22"
            height="135"
            rx="10"
            className={`${regionClasses(value === "leg_right")} cursor-pointer`}
            strokeWidth="2"
            onClick={() => onChange("leg_right")}
          />

          <text x="60" y="395" textAnchor="middle" className="fill-slate-500" fontSize="10">
            FRONT
          </text>
        </g>

        {/* ========= RIGHT: BACK VIEW (clickable back region) ========= */}
        <g transform="translate(110, 0)">
          {/* Back-of-head (still maps to head) */}
          <circle
            cx="60"
            cy="55"
            r="22"
            className={`${regionClasses(value === "head")} cursor-pointer`}
            strokeWidth="2"
            onClick={() => onChange("head")}
          />

          {/* Back region (new) */}
          <rect
            x="35"
            y="90"
            width="50"
            height="122"
            rx="10"
            className={`${regionClasses(value === "back")} cursor-pointer`}
            strokeWidth="2"
            onClick={() => onChange("back")}
          />

          {/* Arms (back view still maps to same arms) */}
          <rect
            x="12"
            y="100"
            width="18"
            height="115"
            rx="10"
            className={`${regionClasses(value === "arm_left")} cursor-pointer`}
            strokeWidth="2"
            onClick={() => onChange("arm_left")}
          />
          <rect
            x="90"
            y="100"
            width="18"
            height="115"
            rx="10"
            className={`${regionClasses(value === "arm_right")} cursor-pointer`}
            strokeWidth="2"
            onClick={() => onChange("arm_right")}
          />

          {/* Legs (back view still maps to same legs) */}
          <rect
            x="40"
            y="225"
            width="22"
            height="135"
            rx="10"
            className={`${regionClasses(value === "leg_left")} cursor-pointer`}
            strokeWidth="2"
            onClick={() => onChange("leg_left")}
          />
          <rect
            x="63"
            y="225"
            width="22"
            height="135"
            rx="10"
            className={`${regionClasses(value === "leg_right")} cursor-pointer`}
            strokeWidth="2"
            onClick={() => onChange("leg_right")}
          />

          <text x="60" y="395" textAnchor="middle" className="fill-slate-500" fontSize="10">
            BACK
          </text>
        </g>
      </svg>

      <div className="mt-3 text-xs text-slate-600 text-center">
        Tip: Tap the right figure to select <span className="font-medium">Back</span>.
      </div>

      <button
        type="button"
        className="mt-3 text-xs underline text-slate-700 block mx-auto"
        onClick={() => onChange("none")}
      >
        Clear selection
      </button>
    </div>
  );
}