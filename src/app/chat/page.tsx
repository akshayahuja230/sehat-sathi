"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { InteractableReferralLetter } from "@/components/referrals/InteractableReferralLetter";
import {
  MessageInput,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from "@/components/tambo/message-input";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import { ThreadContent, ThreadContentMessages } from "@/components/tambo/thread-content";

import { ChatWithTriage } from "./chat-with-triage";
import { InteractableMedicationInstructions } from "@/components/medications/InteractableMedicationInstructions";

export default function ChatPage() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [referralProps, setReferralProps] = useState({
    patient: { fullName: "", dob: "", mrn: "", phone: "" },
    to: { clinicianName: "", clinic: "", specialty: "", fax: "" },
    from: { clinicianName: "", clinic: "", phone: "" },
    reasonForReferral: "",
    urgency: "routine" as "routine" | "urgent" | "stat",
    history: [] as string[],
    relevantPMH: [] as string[],
    meds: [] as string[],
    allergies: [] as string[],
    examFindings: [] as string[],
    assessment: [] as string[],
    requestedWorkup: [] as string[],
    letterMarkdown: "",
  });

  async function generateReferralFromTriage(input: {
    triage: any; // you’ll pass your triage state here
    toSpecialty: string;
    urgency: "routine" | "urgent" | "stat";
    clinicOrDoctor?: string;
    reason?: string;
  }) {
    const res = await fetch("/api/generate-referral-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to generate referral letter");
    }

    const next = await res.json();
    setReferralProps(next); // updates right-side card
  }
  return (
    <div className="h-dvh w-full bg-gray-50 flex overflow-hidden">
      {/* Chat Sidebar */}
      <aside
        className={[
          "relative bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
          isChatOpen ? "w-[360px]" : "w-0",
        ].join(" ")}
      >
        {/* Sidebar content (only render when open so it doesn't squeeze layout) */}
        {isChatOpen && (
          <>
            <div className="shrink-0 p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Chat Assistant
              </h2>
            </div>

            <ScrollableMessageContainer className="flex-1 min-h-0 p-4">
              <ThreadContent variant="default">
                <ThreadContentMessages />
              </ThreadContent>
            </ScrollableMessageContainer>

            <div className="shrink-0 p-4 border-t border-gray-200">
              <MessageInput variant="bordered">
                <MessageInputTextarea placeholder="Ask for instructions or a referral letter..." />
                <MessageInputToolbar>
                  <MessageInputSubmitButton />
                </MessageInputToolbar>
              </MessageInput>
            </div>
          </>
        )}

        {/* Collapse/Expand button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="absolute -right-10 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-r-lg p-2 hover:bg-gray-50 shadow-sm"
          aria-label={isChatOpen ? "Close chat" : "Open chat"}
        >
          {isChatOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-6">
          {/* Two-panel layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left: Triage */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-900">Triage</h2>
                <p className="text-sm text-gray-500">
                  Fill the form and send results to chat.
                </p>
              </div>
              <div className="p-4 max-h-[calc(100dvh-180px)] overflow-auto">
                <ChatWithTriage onGenerateReferral={generateReferralFromTriage} />
              </div>
            </section>

            {/* Right: Medication Instructions (persistent block) */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-900">
                  Medication Instructions
                </h2>
              </div>

              {/* Give it a max height + scroll so it doesn't get weirdly tall */}
              <div className="p-4 max-h-[calc(100dvh-180px)] overflow-auto">
                <InteractableMedicationInstructions
                  id="med-instructions"
                  medicationName="Medication"
                  dose={{ amount: 1, unit: "tablet" }}
                  schedule={{
                    morning: false,
                    noon: false,
                    evening: false,
                    bedtime: false,
                  }}
                  warnings={[]}
                  notesSimple={[]}
                />
              </div>
            </section>


           <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-900">Referral Letter</h2>
                <p className="text-sm text-gray-500">
                  Generated from triage (no prompt needed).
                </p>
              </div>

              <div className="p-4 max-h-[calc(100dvh-180px)] overflow-auto">
                <div id="referral-letter-print">
                  <InteractableReferralLetter id="referral-letter" {...referralProps} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}