"use client";

import type { LanguageCode } from "@/lib/i18n/languages";
import { LANGUAGES } from "@/lib/i18n/languages";

export function LanguageSelector({
  value,
  onChange,
}: {
  value: LanguageCode;
  onChange: (lang: LanguageCode) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium">Language</span>
      <select
        className="border rounded px-3 py-2 bg-white cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value as LanguageCode)}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}