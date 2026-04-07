import { useAudit } from '../context/AuditContext';
import ButtonPrimary from '../components/ButtonPrimary';

/**
 * Step 1 — Confirm property details returned by RentCast.
 *
 * Changes vs original:
 *  • Shows a notice banner when garage or attic are blank (always on first load
 *    since RentCast never provides these fields).
 *  • StatBox renders '—' for blank values so the user can clearly see what needs
 *    to be filled in via "Edit details".
 *  • Confirm button is disabled until both garage AND attic are filled.
 */

const StatBox = ( { label, value, highlight = false } ) => (
  <div
    className={`p-4 rounded-xl text-center border transition-colors ${
      highlight
        ? 'bg-[#FFF8E7] border-[#F0E6D2]'
        : 'bg-[#F9F8F6] border-transparent hover:border-[#EAE7DF]'
    }`}
  >
    <span
      className={`block text-[9px] uppercase tracking-widest font-bold mb-1 ${
        highlight ? 'text-[#A67A1A]' : 'text-audit-neutral'
      }`}
    >
      {label}
    </span>
    <span
      className={`block text-2xl font-black ${
        highlight ? 'text-[#A67A1A]' : 'text-brand-black'
      }`}
    >
      {value || '—'}
    </span>
  </div>
);

const Step1_Confirm = () => {
  const { state, goTo } = useAudit();
  const p = state.property;

  // Garage and attic are always blank from RentCast — user must fill via Edit.
  const missingFields = ! p.garage || ! p.attic;

  return (
    <div className="p-8 md:p-12">
      <h2 className="text-3xl md:text-5xl font-extrabold text-brand-black tracking-tight mb-2">
        We found your property
      </h2>
      <p className="text-base text-audit-neutral mb-6">
        Confirm the details below before we continue.
      </p>

      {/* ── Notice banner — shown when garage / attic are blank ── */}
      {missingFields && (
        <div className="flex items-start gap-3 bg-[#FFF8E7] border border-[#F0D98A] rounded-xl px-5 py-4 mb-6">
          <span className="text-[#A67A1A] text-lg mt-0.5">⚠️</span>
          <p className="text-sm text-[#7A5A10] font-medium leading-snug">
            <strong>Almost there —</strong> your attic details are
            missing. Tap <strong>"Edit details"</strong> below to fill them in
            before continuing. These affect your rent estimate.
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Visual Left Side */}
        <div className="flex-1 rounded-2xl overflow-hidden relative shadow-md bg-gray-100 min-h-[300px]">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Property preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/70 mb-1">
              Current Selection
            </p>
            <h3 className="text-xl text-white font-bold leading-tight">
              {state.address || '123 Main Street'}
            </h3>
          </div>
        </div>

        {/* Data Right Side */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatBox label="Bedrooms"   value={p.beds}  />
            <StatBox label="Bathrooms"  value={p.baths} />
            <StatBox
              label="Sq. Footage"
              value={p.sqft ? `${p.sqft} sqft` : ''}
            />
            {/* Garage — blank until user edits */}
            <StatBox label="Garage" value={p.garage} />
            {/* Attic — blank until user edits */}
            <StatBox label="Attic"  value={p.attic}  />
            {/* Est. Value — gold highlight */}
            <StatBox
              label="Est. Value"
              value={p.estValue ? `$${p.estValue.toLocaleString()}` : ''}
              highlight
            />
          </div>

          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => goTo( 1.5 )}
              className="flex-1 py-4 text-sm font-bold text-audit-neutral hover:text-brand-black transition-colors rounded-xl border border-step-border hover:bg-gray-50 bg-white shadow-sm"
            >
              Edit details
            </button>
            <div className="flex-1">
              {/* Disabled until garage + attic are filled */}
              <ButtonPrimary
                onClick={() => goTo( 2 )}
                disabled={missingFields}
                variant="gold"
              >
                Confirm →
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_Confirm;