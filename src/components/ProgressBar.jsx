/**
 * ProgressBar
 * Gold animated top bar. stepNum starts at 1.
 */
const ProgressBar = ({ stepNum, total = 9 }) => {
  const pct = Math.round((stepNum / total) * 100);

  return (
    <div className="w-full h-1 bg-step-border rounded-full mb-6 overflow-hidden">
      <div
        className="h-full bg-brand-gold rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default ProgressBar;
