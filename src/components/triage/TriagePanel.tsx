"use client";

import { useMemo, useState } from "react";
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

export function TriagePanel({
  onSendToChat,
}: {
  onSendToChat: (message: string) => void;
}) {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [symptomText, setSymptomText] = useState("");
  const [bodyArea, setBodyArea] = useState<BodyArea>("none");
  const [level, setLevel] = useState<TriageLevel | null>(null);

  
    const areaLabel = useMemo(() => t(language, `body_${bodyArea}`), [language, bodyArea]);

    const chatPayload = useMemo(() => {
    if (!level) return "";

    return [
        "TRIAGE INTAKE (structured):",
        `Language: ${language}`,
        `Symptoms: "${symptomText.trim() || "(none)"}"`,
        `Body area: ${areaLabel} (${bodyArea})`,
        `Triage level: ${level.toUpperCase()}`,
        "",
        "Please provide culturally-aware guidance and next steps. Keep it simple and safe.",
    ].join("\n");
    }, [language, symptomText, bodyArea, areaLabel, level]);

  return (
    <div className="border rounded-lg bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">{t(language, "title")}</h2>

        <button
          type="button"
          className="text-sm px-3 py-1 border rounded cursor-pointer"
          onClick={() => {
            setSymptomText("");
            setBodyArea("none");
            setLevel(null);
          }}
        >
          {t(language, "restart")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="space-y-4">
          <LanguageSelector value={language} onChange={setLanguage} />
          <SymptomInput
            language={language}
            value={symptomText}
            onChange={setSymptomText}
          />

          <div className="border rounded p-3 bg-slate-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{t(language, "bodyTitle")}</h3>
              <div className="text-xs text-slate-600">
                {t(language, "selectedArea")}:{" "}
                <span className="font-medium">{t(language, `body_${bodyArea}`)}</span>
              </div>
            </div>

            <div className="mt-2">
              <BodyDiagram value={bodyArea} onChange={setBodyArea} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {!level ? (
            <DecisionTree language={language} onComplete={(lvl) => setLevel(lvl)} />
          ) : (
            <div className="border rounded p-4">
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
                <span
                  className={`inline-flex px-3 py-1 border rounded font-semibold ${badgeClasses(
                    level
                  )}`}
                >
                  {t(language, level)}
                </span>
              </div>

            <div className="mt-4">
                <h4 className="font-semibold text-sm">{t(language, "summary")}</h4>

                <pre className="mt-2 text-xs bg-slate-50 border rounded p-3 whitespace-pre-wrap">
                    {chatPayload}
                </pre>
            </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="px-3 py-2 rounded bg-black text-white text-sm"
                  onClick={() => onSendToChat(chatPayload)}
                >
                  Send to Chat
                </button>

                <button
                  type="button"
                  className="px-3 py-2 rounded border text-sm"
                  onClick={() => {
                    // useful if your chat supports “paste into input”
                    navigator.clipboard.writeText(chatPayload);
                  }}
                >
                  Copy
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Prototype only. Add clinical rules + safety disclaimers for real use.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}