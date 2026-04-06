import { useAudit } from '../context/AuditContext';
import OptionCard from '../components/OptionCard';
import ButtonPrimary from '../components/ButtonPrimary';
import { CONDITION_OPTIONS } from '../constants/options';

const Step2_Condition = () => {
  const { state, update, goTo } = useAudit();
  const select = (val) => update({ condition: val });

  return (
    <div className="p-8 md:p-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-brand-black tracking-tight mb-2">
        What's the property's condition?
      </h2>
      <p className="text-base text-audit-neutral mb-8">
        Be honest — this directly affects your rent estimate.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {CONDITION_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.val}
            label={opt.label}
            sub={opt.sub}
            icon={opt.icon}
            selected={state.condition === opt.val}
            onClick={() => select(opt.val)}
          />
        ))}
      </div>

      <ButtonPrimary
        onClick={() => goTo(3)}
        disabled={!state.condition}
        variant="black"
        className="max-w-[240px]"
      >
        Continue →
      </ButtonPrimary>
    </div>
  );
};

export default Step2_Condition;
