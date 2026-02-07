"use client";

import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      components={components}
      tools={tools}
    >
      {children}
    </TamboProvider>
  );
}