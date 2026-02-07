"use client";

import { withInteractable } from "@tambo-ai/react";
import { ReferralLetter, referralLetterSchema } from "./ReferralLetter";

export const InteractableReferralLetter = withInteractable(ReferralLetter, {
  componentName: "ReferralLetter",
  description:
    "A persistent referral letter to a clinician, including patient history and a final letter body in markdown.",
  propsSchema: referralLetterSchema,
});