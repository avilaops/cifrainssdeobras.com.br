"use client";

import { Check } from "lucide-react";
import { STEPS, type WizardStep } from "./simulator-shell";
import { useWizard } from "./simulator-shell";

export function StepNav() {
  const { step, stepIndex, goTo } = useWizard();

  return (
    <div className="flex items-center gap-0 overflow-x-auto">
      {STEPS.map((s, idx) => {
        const isDone = idx < stepIndex;
        const isCurrent = s.id === step;
        const isAccessible = idx <= stepIndex;

        return (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => isAccessible && goTo(s.id as WizardStep)}
              disabled={!isAccessible}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                isCurrent
                  ? "text-[#1b3629]"
                  : isDone
                  ? "text-[#4a6b5a] hover:text-[#1b3629]"
                  : "cursor-default text-[#b0bdb5]"
              }`}
            >
              {/* Step circle */}
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                  isCurrent
                    ? "bg-[#1b3629] text-white"
                    : isDone
                    ? "bg-[#2e5240] text-white"
                    : "bg-[#e8eae3] text-[#8a9890]"
                }`}
              >
                {isDone ? <Check className="size-3" /> : idx + 1}
              </span>
              {/* Label — hidden on very small screens */}
              <span className="hidden sm:inline whitespace-nowrap">{s.label}</span>
            </button>

            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <span
                className={`mx-1 h-px w-6 shrink-0 transition-colors ${
                  idx < stepIndex ? "bg-[#2e5240]" : "bg-[#e2e4dc]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
