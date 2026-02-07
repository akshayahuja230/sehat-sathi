"use client";

import { useState } from "react";
import type { LanguageCode } from "@/lib/i18n/languages";
import { t } from "@/lib/i18n/triageStrings";

import { LanguageSelector } from "@/components/triage/LanguageSelector";
import { SymptomInput } from "@/components/triage/SymptomInput";
import { BodyDiagram } from "@/components/triage/BodyDiagram";
import { DecisionTree } from "@/components/triage/DecisionTree";

import type { BodyArea } from "@/services/triage/triageEngine";
import { buildTriageSummary } from "@/services/triage/triageEngine";
import type { TriageLevel } from "@/services/triage/decisionTree";

function badgeClasses(level: TriageLevel) {
  switch (level) {
    case "emergency":
      return "bg-red-100 text-red-800 border-red-200";
    case "urgent":
      return "bg-amber-100 text-amber-800 border-amber-200";
    default:
      return "bg-green-100 text-green-800 border-green-200";
  }
}

export default function TriagePage() {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [symptomText, setSymptomText] = useState("");
  const [bodyArea, setBodyArea] = useState<BodyArea>("none");
  const [level, setLevel] = useState<TriageLevel | null>(null);

  const result = level
    ? buildTriageSummary(
        { language, symptomText, bodyArea },
        level
      )
    : null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{t(language, "title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Left: Input + Body Diagram */}
        <div className="space-y-4">
          <LanguageSelector value={language} onChange={setLanguage} />

          <SymptomInput language={language} value={symptomText} onChange={setSymptomText} />

          <div className="border rounded p-4 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{t(language, "bodyTitle")}</h3>
              <div className="text-xs text-slate-600">
                {t(language, "selectedArea")}: <span className="font-medium">{bodyArea}</span>
              </div>
            </div>
            <div className="mt-3">
              <BodyDiagram value={bodyArea} onChange={setBodyArea} />
            </div>
          </div>
        </div>

        {/* Right: Decision Tree + Result */}
        <div className="space-y-4">
          {!level ? (
            <DecisionTree language={language} onComplete={(lvl) => setLevel(lvl)} />
          ) : (
            <div className="border rounded p-4 bg-white">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">{t(language, "result")}</h3>
                <button
                  type="button"
                  className="text-sm px-3 py-1 border rounded"
                  onClick={() => setLevel(null)}
                >
                  {t(language, "restart")}
                </button>
              </div>

              <div className="mt-3">
                <span className={`inline-flex px-3 py-1 border rounded font-semibold ${badgeClasses(level)}`}>
                  {t(language, level)}
                </span>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-sm">{t(language, "summary")}</h4>
                <pre className="mt-2 text-xs bg-slate-50 border rounded p-3 whitespace-pre-wrap">
                  {result?.summary}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 text-xs text-slate-500">
        Note: This is a prototype triage flow. Add real clinical rules + local safety content before field use.
      </div>
    </div>
  );
}