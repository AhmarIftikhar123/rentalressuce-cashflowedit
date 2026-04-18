/**
 * DisclaimerBanner
 *
 * Displays a legal / accuracy disclaimer above the GlobalProgress bar.
 * Visible on all steps of the cashflow audit tool (steps 0–6).
 * Uses the WordPress dashicons `dashicons-warning` icon (exclamation mark).
 *
 * Drop this file into: src/components/DisclaimerBanner.jsx
 * Then import & render it inside GlobalProgress.jsx (see below).
 */

const DisclaimerBanner = () => (
  <div className="flex items-start gap-2.5 bg-brand-gold-light border border-brand-gold/25 rounded-[14px] px-4 py-3 mb-4">
    {/* WordPress dashicons exclamation / warning icon */}
    <span
      className="dashicons dashicons-warning !text-[18px] !w-[18px] !h-[18px] !flex !items-center !justify-center !leading-none text-brand-gold-dark flex-shrink-0 mt-[1px]"
      aria-hidden="true"
    />
    <p className="text-[11px] leading-relaxed text-brand-gold-dark font-medium mb-0">
      <strong className="font-extrabold">Disclaimer:</strong>{" "}
      These figures are conservative estimates based on typical market
      performance. Actual results vary by property, location, and execution.
      For a detailed income analysis and strategy, consult with a{" "}
      <strong className="font-extrabold">Rental Rescue Portfolio Architect</strong>.
    </p>
  </div>
);

export default DisclaimerBanner;