import { useAudit } from "../context/AuditContext";
import DisclaimerBanner from "./DisclaimerBanner";

/**
 * GlobalProgress
 * Replaces StepHeader logic to become a global header that renders outside the specific steps.
 */
const GlobalProgress = () => {
  const { state, goTo } = useAudit();

  // Don't show progress for capturing or results if we don't want to.
  // Wait, the user wanted it globally but maybe not Step 7/8. Let's make it disappear on Step 7 & 8 since they are strictly result banners.
  if (state.step >= 7) return null;

  // We have 8 effective steps before results (0, 1, 1.5, 2, 3, 4, 5, 6)
  // We map step numbers to clean UI counts.
  // 0 = Step 1
  // 1 & 1.5 = Step 2
  // 2 = Step 3
  // ...
  const displayStep = Math.floor(state.step) + 1;
  const isEdit = state.step === 1.5;
  const previousStep = state.step === 0 ? null : isEdit ? 0 : state.step - 1;

  const handleBack = () => {
    if (previousStep !== null) goTo(previousStep);
  };

  return (
    <div className="mb-4">
      {/* ── Disclaimer banner — visible on every step ── */}
      <DisclaimerBanner />
      {/* Step counter + back */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold tracking-widest uppercase text-brand-gold">
          Step {displayStep} of 7
        </span>
        {previousStep !== null && (
          <button
            onClick={handleBack}
            className="text-xs text-brand-gold hover:text-brand-dark transition-colors flex items-center gap-1 font-semibold"
          >
            ← Back
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="w-full h-1 bg-step-border rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-gold rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.round((displayStep / 7) * 100)}%` }}
        />
      </div>
    </div>
  );
};

export default GlobalProgress;
