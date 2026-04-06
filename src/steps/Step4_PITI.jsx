import { useAudit } from '../context/AuditContext';
import OptionCard from '../components/OptionCard';
import ButtonPrimary from '../components/ButtonPrimary';
import { PITI_OPTIONS } from '../constants/options';

const Step4_PITI = () => {
  const { state, update, goTo } = useAudit();
  const select = (val) => update({ piti: val });

  return (
    <div className="p-8 md:p-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-brand-black tracking-tight mb-2 text-center">
        What's your monthly payment (PITI)?
      </h2>
      <p className="text-base text-audit-neutral mb-8 text-center max-w-xl mx-auto">
        Principal + Interest + Taxes + Insurance — your full monthly obligation.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
        {PITI_OPTIONS.map((opt, i) => (
          <OptionCard
            key={opt.val + i}
            label={opt.label}
            compact={true}
            selected={state.piti === opt.val}
            onClick={() => select(opt.val)}
          />
        ))}
      </div>

      <div className="flex justify-center">
          <ButtonPrimary
            onClick={() => goTo(5)}
            disabled={!state.piti}
            variant="black"
            className="max-w-[240px]"
          >
            Continue →
          </ButtonPrimary>
      </div>
    </div>
  );
};

export default Step4_PITI;
