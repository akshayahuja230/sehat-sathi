"use client";

import { useMemo, useState } from "react";
import { TRIAGE_TREE, type TriageLevel } from "@/services/triage/decisionTree";
import type { LanguageCode } from "@/lib/i18n/languages";
import { t } from "@/lib/i18n/triageStrings";

type Step = { nodeId: string };

export function DecisionTree({
  language,
  onComplete,
}: {
  language: LanguageCode;
  onComplete: (level: TriageLevel) => void;
}) {
  const [history, setHistory] = useState<Step[]>([{ nodeId: "start" }]);

  const node = useMemo(() => {
    const current = history[history.length - 1];
    return TRIAGE_TREE[current.nodeId];
  }, [history]);

  function choose(option: { nextNodeId?: string; outcome?: TriageLevel }) {
    if (option.outcome) {
      onComplete(option.outcome);
      return;
    }
    if (option.nextNodeId) {
      setHistory((h) => [...h, { nodeId: option.nextNodeId! }]);
    }
  }

  function back() {
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  }

  function restart() {
    setHistory([{ nodeId: "start" }]);
  }

  return (
    <div className="border rounded p-4 bg-white">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">{t(language, "dt_title")}</h3>

        <div className="flex gap-2">
          <button
            type="button"
            className="text-sm px-3 py-1 border rounded cursor-pointer"
            onClick={back}
            disabled={history.length <= 1}
          >
            {t(language, "back")}
          </button>

          <button
            type="button"
            className="text-sm px-3 py-1 border rounded cursor-pointer"
            onClick={restart}
          >
            {t(language, "restart")}
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm">{t(language, node.questionKey)}</p>

      <div className="mt-3 flex flex-col gap-2">
        {node.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="text-left px-3 py-2 border rounded hover:bg-slate-50 cursor-pointer"
            onClick={() => choose(opt)}
          >
            {t(language, opt.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}