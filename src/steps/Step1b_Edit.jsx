import { useAudit } from '../context/AuditContext';
import StepHeader from '../components/StepHeader';
import OptionCard from '../components/OptionCard';
import ButtonPrimary from '../components/ButtonPrimary';
import {
  BEDS_OPTIONS,
  BATHS_OPTIONS,
  SQFT_OPTIONS,
  GARAGE_OPTIONS,
  ATTIC_OPTIONS,
} from '../constants/options';

/**
 * Step 1b — Edit property details.
 * Used when:
 *   (a) User taps "Edit" from Step 1 (Zillow path — override auto-filled data)
 *   (b) Google Places path — user fills in all details themselves
 *
 * Also collects Est. Value via a text input.
 */

const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-semibold tracking-widest uppercase text-audit-neutral mt-5 mb-2">
    {children}
  </p>
);

const Step1b_Edit = () => {
  const { state, update, goTo } = useAudit();
  const p = state.property;

  const set = (field, val) =>
    update({ property: { ...p, [field]: val } });

  const isValid =
    p.beds && p.baths && p.sqft && p.garage && p.attic && p.estValue;

  const handleValueChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    set('estValue', raw ? parseInt(raw, 10) : '');
  };

  // Back: if coming from confirm (step 1) go back there; else go to address (0)
  const backStep = state.step === 1.5 ? 1 : 0;

  return (
    <div className="p-6">
      <h2 className="text-3xl md:text-4xl font-extrabold text-brand-black tracking-tight mb-2">
        Edit property details
      </h2>
      <p className="text-base text-audit-neutral mb-8">
        Tap any option to correct it.
      </p>

      {/* Bedrooms */}
      <SectionLabel>Bedrooms</SectionLabel>
      <div className="grid grid-cols-3 gap-2">
        {BEDS_OPTIONS.map((o) => (
          <OptionCard
            key={o}
            label={o}
            selected={p.beds === o}
            onClick={() => set('beds', o)}
          />
        ))}
      </div>

      {/* Bathrooms */}
      <SectionLabel>Bathrooms</SectionLabel>
      <div className="grid grid-cols-3 gap-2">
        {BATHS_OPTIONS.map((o) => (
          <OptionCard
            key={o}
            label={o}
            selected={p.baths === o}
            onClick={() => set('baths', o)}
          />
        ))}
      </div>

      {/* Square footage */}
      <SectionLabel>Square footage</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        {SQFT_OPTIONS.map((o) => (
          <OptionCard
            key={o}
            label={o}
            selected={p.sqft === o}
            onClick={() => set('sqft', o)}
          />
        ))}
      </div>

      {/* Garage */}
      <SectionLabel>Garage</SectionLabel>
      <div className="grid grid-cols-3 gap-2">
        {GARAGE_OPTIONS.map((o) => (
          <OptionCard
            key={o}
            label={o}
            selected={p.garage === o}
            onClick={() => set('garage', o)}
          />
        ))}
      </div>

      {/* Attic */}
      <SectionLabel>Attic</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        {ATTIC_OPTIONS.map((o) => (
          <OptionCard
            key={o}
            label={o}
            selected={p.attic === o}
            onClick={() => set('attic', o)}
          />
        ))}
      </div>

      {/* Estimated value */}
      <SectionLabel>Estimated property value</SectionLabel>
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-audit-neutral font-semibold">
          $
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={p.estValue ? Number(p.estValue).toLocaleString() : ''}
          onChange={handleValueChange}
          placeholder="420,000"
          className="w-full !pl-8 pr-4 py-3 rounded-opt border border-step-border bg-brand-cream text-brand-black text-sm placeholder:text-audit-neutral focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
        />
      </div>

      <ButtonPrimary
        onClick={() => goTo(2)}
        disabled={!isValid}
        variant="black"
      >
        Save & continue →
      </ButtonPrimary>
    </div>
  );
};

export default Step1b_Edit;
