import type { FC } from "react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  currentStep: number; // 1-indexed
  className?: string;
}

const Stepper: FC<StepperProps> = ({ steps, currentStep, className }) => {
  return (
    <ol className={cn("flex w-full items-center gap-4", className)}>
      {steps.map((label, idx) => {
        const stepIndex = idx + 1;
        const isCompleted = stepIndex < currentStep;
        const isActive = stepIndex === currentStep;
        return (
          <li key={label} className="flex-1">
            <div className="flex items-center">
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
                  isCompleted && "bg-primary text-primary-foreground border-primary",
                  isActive && !isCompleted && "bg-accent text-accent-foreground border-accent",
                  !isCompleted && !isActive && "bg-muted text-muted-foreground border-border"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {stepIndex}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "-ml-1 mr-2 h-0.5 flex-1",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
            <div className="mt-2 text-xs font-medium text-muted-foreground">
              {label}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default Stepper;
