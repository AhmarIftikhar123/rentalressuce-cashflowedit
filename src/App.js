import { AuditProvider, useAudit } from './context/AuditContext';
import GlobalProgress from './components/GlobalProgress';

// Steps
import Step0_Address    from './steps/Step0_Address';
import Step1_Confirm    from './steps/Step1_Confirm';
import Step1b_Edit      from './steps/Step1b_Edit';
import Step2_Condition  from './steps/Step2_Condition';
import Step3_Usage      from './steps/Step3_Usage';
import Step4_PITI       from './steps/Step4_PITI';
import Step5_LoanBalance from './steps/Step5_LoanBalance';
import Step6_Goal       from './steps/Step6_Goal';
import Step7_Results    from './steps/Step7_Results';
import Step8_Capture    from './steps/Step8_Capture';

/**
 * StepRouter
 * Reads `state.step` from context and renders the correct step component.
 * App.js owns zero business logic — it only switches views.
 */
const StepRouter = () => {
  const { state } = useAudit();

  const stepMap = {
    0:   <Step0_Address />,
    1:   <Step1_Confirm />,
    1.5: <Step1b_Edit />,
    2:   <Step2_Condition />,
    3:   <Step3_Usage />,
    4:   <Step4_PITI />,
    5:   <Step5_LoanBalance />,
    6:   <Step6_Goal />,
    7:   <Step7_Results />,
    8:   <Step8_Capture />,
  };

  const ActiveStep = stepMap[state.step] ?? stepMap[0];

  return (
    <div className="min-h-[75dvh] bg-step-bg flex items-start md:items-center justify-center py-12 px-4 font-sans">
      <div className="w-full max-w-4xl">
        <GlobalProgress />
        
        {/* Outer card wrapper. */}
        <div className="bg-step-card rounded-[24px] shadow-card overflow-hidden">
          {ActiveStep}
        </div>

        {/* Tiny brand footer */}
        <p className="text-center text-[12px] text-audit-neutral mt-6">
          Rental Rescue &mdash; Powered by real market data
        </p>
      </div>
    </div>
  );
};

const App = () => (
  <AuditProvider>
    <StepRouter />
  </AuditProvider>
);

export default App;
