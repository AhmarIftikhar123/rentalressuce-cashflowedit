import { useState } from '@wordpress/element';
import { useAudit } from '../context/AuditContext';
import ButtonPrimary from '../components/ButtonPrimary';
import { submitAudit } from '../utils/api';

/**
 * Step 8 — Lead capture.
 * Collects name, email, phone then POSTs to WP REST → FluentCRM.
 */

const FieldLabel = ({ children }) => (
  <label className="block text-[10px] font-semibold tracking-widest uppercase text-audit-neutral mb-1.5">
    {children}
  </label>
);

const TextInput = ({ type = 'text', value, onChange, placeholder, disabled }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className="w-full px-4 py-3 rounded-opt border border-step-border bg-brand-cream text-brand-black text-sm placeholder:text-audit-neutral focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold mb-4 transition-colors disabled:opacity-50"
  />
);

const Step8_Capture = () => {
  const { state, update, goTo } = useAudit();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');
  const [done, setDone]             = useState(false);

  const isValid =
    state.leadName.trim() &&
    state.leadEmail.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.leadEmail);

  const handleSubmit = async () => {
    if (!isValid) return;
    setError('');
    setSubmitting(true);

    try {
      await submitAudit({
        name:   state.leadName.trim(),
        email:  state.leadEmail.trim(),
        phone:  state.leadPhone.trim(),
        audit: {
          ...state.auditResults,
          goal:       state.goal,
          condition:  state.condition,
          currentUse: state.currentUse,
          address:    state.address,
          property:   state.property,
        },
      });
      setDone(true);
    } catch (err) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success state ────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="p-6 text-center py-12">
        <div className="w-14 h-14 rounded-full bg-audit-positive/10 flex items-center justify-center mx-auto mb-4 border-2 border-audit-positive/20">
          <svg className="w-7 h-7 text-audit-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-brand-black mb-2">You're all set!</h2>
        <p className="text-sm text-audit-neutral mb-1">
          Your personalised Cashflow Audit is on its way to
        </p>
        <p className="text-sm font-semibold text-brand-black mb-6">
          {state.leadEmail}
        </p>
        <p className="text-xs text-audit-neutral">Check your inbox within a few minutes.</p>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-8 md:p-12">
      {/* Header — no StepHeader component, custom layout for final step */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold tracking-widest uppercase text-audit-neutral">
          Final step
        </span>
        <button
          onClick={() => goTo(7)}
          className="text-xs text-audit-neutral hover:text-brand-black transition-colors"
        >
          ← Back
        </button>
      </div>

      <h2 className="text-2xl font-bold text-brand-black mb-1">
        Get your full strategy plan
      </h2>
      <p className="text-sm text-audit-neutral mb-6">
        We'll send you a personalised execution roadmap — rental model, pricing, and exact next steps.
      </p>

      <FieldLabel>Full name</FieldLabel>
      <TextInput
        value={state.leadName}
        onChange={(e) => update({ leadName: e.target.value })}
        placeholder="Your full name"
        disabled={submitting}
      />

      <FieldLabel>Email address</FieldLabel>
      <TextInput
        type="email"
        value={state.leadEmail}
        onChange={(e) => update({ leadEmail: e.target.value })}
        placeholder="you@email.com"
        disabled={submitting}
      />

      <FieldLabel>Phone number</FieldLabel>
      <TextInput
        type="tel"
        value={state.leadPhone}
        onChange={(e) => update({ leadPhone: e.target.value })}
        placeholder="+1 (555) 000-0000"
        disabled={submitting}
      />

      {error && (
        <p className="text-xs text-audit-negative mb-3 -mt-2">{error}</p>
      )}

      <ButtonPrimary
        onClick={handleSubmit}
        disabled={!isValid || submitting}
        variant="gold"
      >
        {submitting ? 'Sending…' : 'Send My Strategy Plan →'}
      </ButtonPrimary>

      <p className="text-center text-[11px] text-audit-neutral mt-3">
        No spam. Just the strategy your property needs.
      </p>
    </div>
  );
};

export default Step8_Capture;
