import { useAudit } from '../context/AuditContext';

/**
 * StepHeader
 * Renders: "STEP X OF 9   ← Back" row + ProgressBar + title + subtitle.
 * backStep can be a number or a function for custom back logic.
 */
const StepHeader = ({ stepNum, total = 9, title, subtitle, backStep }) => {
  const { goTo } = useAudit();

  const handleBack = () => {
    if (typeof backStep === 'function') backStep();
    else if (backStep != null) goTo(backStep);
  };

  return (
    <div className="mb-2">
      {/* Step counter + back */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold tracking-widest uppercase text-audit-neutral">
          Step {stepNum} of {total}
        </span>
        {backStep != null && (
          <button
            onClick={handleBack}
            className="text-xs text-audit-neutral hover:text-brand-black transition-colors flex items-center gap-1"
          >
            ← Back
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="w-full h-[3px] bg-step-border rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-brand-gold rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.round((stepNum / total) * 100)}%` }}
        />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-brand-black mb-1 leading-tight">
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-sm text-audit-neutral mb-6">{subtitle}</p>
      )}
    </div>
  );
};

export default StepHeader;
