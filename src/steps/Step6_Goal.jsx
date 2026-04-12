import { useAudit } from '../context/AuditContext';
import OptionCard from '../components/OptionCard';
import ButtonPrimary from '../components/ButtonPrimary';
import { GOAL_OPTIONS } from '../constants/options';
import { runAuditCalc } from '../utils/calculations';

/**
 * Step 6 — Goal selection.
 *
 * Changes vs previous version:
 *  • After runAuditCalc(), builds a base64-encoded resultsUrl and stores it
 *    in AuditContext so Step8_Capture can include it in the submit payload.
 *  • All existing navigation / calc logic is completely unchanged.
 */

/**
 * Encode the audit results + key context fields into a URL-safe base64 string.
 * The ResultsViewer page decodes this to re-hydrate Step7_Results.
 *
 * Only the fields Step7_Results actually renders are included — keeps the
 * URL as short as possible while remaining self-contained.
 */
function buildResultsUrl( results, state ) {
  const payload = {
    // Calculated results (everything Step7_Results reads from r.*)
    ...results,
    // Address shown in context — not rendered by Step7 but useful for admins
    address: state.address,
  };

  try {
    const encoded = btoa( unescape( encodeURIComponent( JSON.stringify( payload ) ) ) );
    const base    = window?.rentalAuditConfig?.resultsPageUrl
      ?? ( window.location.origin + '/rental-audit-results/' );
    return `${base}?d=${encoded}`;
  } catch ( e ) {
    // btoa can fail on exotic characters — return empty string gracefully
    return '';
  }
}

const Step6_Goal = () => {
  const { state, update, goTo } = useAudit();

  const select = ( val ) => update( { goal: val } );

  const handleFinish = () => {
    // 1. Run the calculation engine (unchanged)
    const results = runAuditCalc( state );

    // 2. Build the shareable results URL (new — additive only)
    const resultsUrl = buildResultsUrl( results, state );

    // 3. Store both in context and navigate (unchanged except resultsUrl added)
    update( { auditResults: results, resultsUrl } );
    goTo( 7 );
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
        {GOAL_OPTIONS.map( ( opt ) => (
          <OptionCard
            key={opt.val}
            label={opt.label}
            sub={opt.sub}
            icon={opt.icon}
            selected={state.goal === opt.val}
            onClick={() => select( opt.val )}
          />
        ) )}
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