import { useAudit } from '../context/AuditContext';
import OptionCard from '../components/OptionCard';
import ButtonPrimary from '../components/ButtonPrimary';
import { GOAL_OPTIONS } from '../constants/options';
import { runAuditCalc } from '../utils/calculations';

const Step6_Goal = () => {
  const { state, update, goTo } = useAudit();

  const select = (val) => update({ goal: val });

  const handleFinish = () => {
    // Run the engine
    const results = runAuditCalc(state);
    update({ auditResults: results });
    goTo(7);
  };

  return (
    <div className="p-8 md:p-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-brand-black tracking-tight mb-2">
        What's your goal with this property?
      </h2>
      <p className="text-base text-audit-neutral mb-8">
        Your answer shapes the entire recommendation we build for you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {GOAL_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.val}
            label={opt.label}
            sub={opt.sub}
            icon={opt.icon}
            selected={state.goal === opt.val}
            onClick={() => select(opt.val)}
          />
        ))}
      </div>

      <ButtonPrimary
        onClick={handleFinish}
        disabled={!state.goal}
        variant="gold"
        className="max-w-[280px]"
      >
        Reveal Cashflow Audit →
      </ButtonPrimary>
    </div>
  );
};

export default Step6_Goal;
