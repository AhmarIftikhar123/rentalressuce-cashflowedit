import { useAudit } from "../context/AuditContext";
import { fmtMoney, fmtMonthly } from "../utils/calculations";

/**
 * Step 7 — Cashflow Audit Results.
 *
 * Changes vs original:
 *  • Optimized Potential card now shows all 4 strategies:
 *      MTR, STR, Section 8, By-the-Room
 *  • Upside headline still uses STR − LTR (highest possible vs baseline)
 *  • "Optimized Cash Flow" highlight block shows STR/mo (best case)
 */

const CardTitle = ({ title, icon, color = "text-audit-neutral" }) => (
  <h3
    className={`text-[12px] font-black uppercase tracking-widest ${color} flex items-center gap-2 mb-6`}
  >
    <span
      className={`dashicons ${icon} !text-[20px] !w-5 !h-5 !flex !items-center !justify-center !leading-none`}
    />
    {title}
  </h3>
);

// Strategy badge pills
const MtrTag = () => (
  <span className="ml-2 inline-block px-1.5 py-0.5 bg-brand-cream-dark text-[#1E429F] text-[8px] font-black uppercase tracking-wider rounded">
    Mid-term
  </span>
);
const StrTag = () => (
  <span className="ml-2 inline-block px-1.5 py-0.5 bg-brand-gold-light text-[#92400E] text-[8px] font-black uppercase tracking-wider rounded">
    Short-term
  </span>
);
const Sec8Tag = () => (
  <span className="ml-2 inline-block px-1.5 py-0.5 bg-green-100 text-[#166534] text-[8px] font-black uppercase tracking-wider rounded">
    Section 8
  </span>
);
const RoomTag = () => (
  <span className="ml-2 inline-block px-1.5 py-0.5 bg-purple-100 text-[#6B21A8] text-[8px] font-black uppercase tracking-wider rounded">
    By-the-Room
  </span>
);

const ValueBox = ({ label, value, tag = null, isRed = false }) => (
  <div className="bg-white rounded-[16px] px-5 py-4 flex justify-between items-center shadow-sm border border-step-border/40 mb-3">
    <div className="flex items-center flex-wrap gap-1">
      <span className="text-[13px] font-bold text-brand-black">{label}</span>
      {tag}
    </div>
    <span
      className={`text-[17px] font-black ${
        isRed ? "text-audit-negative" : "text-brand-black"
      }`}
    >
      {value}
    </span>
  </div>
);

const Step7_Results = () => {
  const { state, goTo } = useAudit();
  const r = state.auditResults;

  if (!r) {
    return (
      <div className="p-12 text-center text-audit-neutral text-sm animate-pulse font-bold tracking-widest uppercase">
        Fetching Analysis Results…
      </div>
    );
  }

  return (
    <div className="bg-step-bg">
      {/* 1. TOP HERO BANNER */}
      <div className="px-6 pt-6 md:px-10 md:pt-10">
        <div className="bg-gradient-to-br from-[#4D545E] to-[#2D3540] rounded-[24px] px-10 py-12 md:py-16 shadow-2xl relative overflow-hidden text-center md:text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-[0.03] rounded-full blur-3xl -translate-y-1/3 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10">
            <p className="text-[10px] font-black tracking-[0.25em] uppercase text-brand-gold mb-4 opacity-90">
              Optimization Result
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-5 max-w-2xl">
              <span className="text-brand-gold">+{fmtMonthly(r.upside)}</span>{" "}
              potential monthly income you may be leaving on the table
            </h2>
            <p className="text-sm md:text-base text-white/50 max-w-xl leading-relaxed font-medium">
              Based on current market volatility and your local equity position,
              your portfolio is under-performing its maximum yield capacity.
            </p>
            {/* Data source badge */}
            {r.usedRentCast && (
              <p className="mt-4 text-[10px] font-bold tracking-widest uppercase text-brand-gold/60">
                ✓ Powered by RentCast live market data
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. PERFORMANCE GRID */}
      <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left — Current Performance */}
        <div className="bg-white/40 p-8 rounded-[32px] border border-white/60 shadow-sm">
          <CardTitle title="Current Performance" icon="dashicons-chart-line" />

          <ValueBox label="Market Rent (LTR)" value={fmtMonthly(r.baseLTR)} />
          <ValueBox label="PITI" value={fmtMonthly(r.piti)} isRed />

          {/* Net highlight */}
          <div className="bg-brand-cream rounded-[24px] p-6 border border-[#E9E5DB] mt-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-3">
              <span className="dashicons dashicons-money-alt !text-[24px] !w-6 !h-6 !flex !items-center !justify-center !leading-none" />
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase text-brand-dark opacity-60 mb-1">
              Monthly Net (LTR)
            </span>
            <span className="text-4xl font-black text-brand-gold tracking-tight">
              {fmtMonthly(r.ltr_cf)}
            </span>
          </div>
        </div>

        {/* Right — Optimized Potential (all 4 strategies) */}
        <div className="bg-white/40 p-8 rounded-[32px] border border-white/60 shadow-sm">
          <CardTitle
            title="Optimized Potential"
            icon="dashicons-performance"
            color="text-brand-gold"
          />

          <ValueBox
            label="MTR Income"
            value={fmtMonthly(r.baseMTR)}
            tag={<MtrTag />}
          />
          <ValueBox
            label="STR Income"
            value={fmtMonthly(r.baseSTR)}
            tag={<StrTag />}
          />
          <ValueBox
            label="Section 8"
            value={fmtMonthly(r.baseSec8)}
            tag={<Sec8Tag />}
          />
          <ValueBox
            label="By-the-Room"
            value={fmtMonthly(r.baseRoom)}
            tag={<RoomTag />}
          />

          {/* Best-case cash flow highlight */}
          <div className="bg-gradient-to-r from-brand-gold-dark to-brand-gold rounded-[24px] p-6 mt-6 flex flex-col items-center text-center shadow-xl shadow-brand-gold/20">
            <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center mb-3">
              <span className="text-[24px] leading-none">⚡</span>
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase text-white/70 mb-1">
              Best-Case Cash Flow (STR)
            </span>
            <span className="text-4xl font-black text-white tracking-tight">
              {fmtMonthly(r.str_cf)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. EQUITY FOOTER */}
      <div className="bg-white px-8 py-10 md:px-16 md:py-14 border-t border-step-border/50">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-full mb-10">
            <div className="flex justify-between items-end mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-gold/5 text-brand-gold flex items-center justify-center">
                  <span className="dashicons dashicons-admin-multisite !text-[18px]" />
                </div>
                <span className="text-[11px] font-black text-audit-neutral uppercase tracking-widest">
                  Equity Position
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold text-audit-neutral uppercase tracking-widest mb-1">
                  Estimated Equity
                </span>
                <span className="text-3xl md:text-5xl font-black text-brand-gold tracking-tight">
                  {fmtMoney(r.equity)}
                </span>
              </div>
            </div>

            <div className="h-4 bg-brand-cream-dark rounded-full overflow-hidden w-full mb-3 shadow-inner">
              <div
                className="h-full bg-brand-gold rounded-full transition-all duration-1000 ease-in-out"
                style={{
                  width: `${Math.max(
                    2,
                    Math.min(100, Math.abs(r.equityPct)),
                  )}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-black tracking-widest text-audit-neutral uppercase opacity-40">
              <span>0% Equity</span>
              <span>{r.equityPct}% Built</span>
              <span>100% Owned</span>
            </div>
          </div>

          <button
            data-viewer-hide
            onClick={() => goTo(8)}
            className="w-full md:w-auto bg-brand-gold-dark text-[13px] text-white font-black uppercase tracking-[0.15em] py-5 px-12 rounded-full shadow-2xl hover:bg-brand-black transition-all hover:scale-[1.05] flex items-center justify-center gap-3 active:scale-95"
          >
            Get My Full Strategy Plan <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step7_Results;
