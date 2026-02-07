"use client";

import type { LanguageCode } from "@/lib/i18n/languages";
import { t } from "@/lib/i18n/triageStrings";

export function SymptomInput({
  language,
  value,
  onChange,
}: {
  language: LanguageCode;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium">{t(language, "symptomsTitle")}</span>
      <textarea
        className="border rounded px-3 py-2 min-h-[90px]"
        placeholder={t(language, "symptomPlaceholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}