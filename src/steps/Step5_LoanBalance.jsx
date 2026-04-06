import { useAudit } from '../context/AuditContext';
import OptionCard from '../components/OptionCard';
import ButtonPrimary from '../components/ButtonPrimary';
import { LOAN_OPTIONS } from '../constants/options';

const Step5_LoanBalance = () => {
  const { state, update, goTo } = useAudit();
  const select = (val) => update({ loanBalance: val });

  return (
    <div className="p-8 md:p-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-brand-black tracking-tight mb-2 text-center">
        What's your remaining loan balance?
      </h2>
      <p className="text-base text-audit-neutral mb-8 text-center max-w-xl mx-auto">
        We use this alongside property value to identify your estimated equity position.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
        {LOAN_OPTIONS.map((opt, i) => (
          <OptionCard
            key={opt.val + i}
            label={opt.label}
            compact={true}
            selected={state.loanBalance === opt.val}
            onClick={() => select(opt.val)}
          />
        ))}
      </div>

      <div className="flex justify-center">
          <ButtonPrimary
            onClick={() => goTo(6)}
            disabled={!state.loanBalance}
            variant="black"
            className="max-w-[240px]"
          >
            Continue →
          </ButtonPrimary>
      </div>
    </div>
  );
};

export default Step5_LoanBalance;
