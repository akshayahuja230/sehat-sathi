"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { TriagePanel } from "@/components/triage/TriagePanel";
import { useTamboThreadInput } from "@tambo-ai/react";

export function ChatWithTriage() {
  const { setValue, submit, isPending } = useTamboThreadInput();

  return (
    <div className="h-screen flex flex-col">
      {/* Triage panel on top */}
      <div className="p-4 border-b bg-slate-50">
        <TriagePanel
          onSendToChat={async (text) => {
            // Fill the chat input with the triage summary
            setValue(`Based on this triage JSON, update MedicationInstructions id med-instructions : ${text}`);

            // Optional: auto-send immediately
            // Comment this out if you want the user to review/edit before sending.
            if (!isPending) {
              await submit({ streamResponse: true });
            }
          }}
        />
      </div>

      {/* Chat thread below */}
      <div className="flex-1 min-h-0">
        <MessageThreadFull />
      </div>
    </div>
  );
}