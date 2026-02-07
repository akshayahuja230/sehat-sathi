"use client";

import { withInteractable } from "@tambo-ai/react";
import {
  MedicationInstructions,
  medicationInstructionsSchema,
} from "@/components/medications/MedicationInstructions";

export const InteractableMedicationInstructions = withInteractable(
  MedicationInstructions,
  {
    componentName: "MedicationInstructions", // MUST match what you instruct the model to update
    description: "A persistent card showing medication dose, schedule, warnings, and notes.",
    propsSchema: medicationInstructionsSchema,
  }
);