import { useAudit } from '../context/AuditContext';
import OptionCard from '../components/OptionCard';
import ButtonPrimary from '../components/ButtonPrimary';
import { USAGE_OPTIONS } from '../constants/options';

const Step3_Usage = () => {
  const { state, update, goTo } = useAudit();
  const select = (val) => update({ currentUse: val });

  return (
    <div className="p-8 md:p-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-brand-black tracking-tight mb-2">
        How is the property currently used?
      </h2>
      <p className="text-base text-audit-neutral mb-8">
        This establishes your baseline so we can measure your upside.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {USAGE_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.val}
            label={opt.label}
            sub={opt.sub}
            icon={opt.icon}
            selected={state.currentUse === opt.val}
            onClick={() => select(opt.val)}
            fullWidth={opt.val === 'owner'}
          />
        ))}
      </div>

      <ButtonPrimary
        onClick={() => goTo(4)}
        disabled={!state.currentUse}
        variant="black"
        className="max-w-[240px]"
      >
        Continue →
      </ButtonPrimary>
    </div>
  );
};

export default Step3_Usage;
