import { useState } from "@wordpress/element";
import { useAudit } from "../context/AuditContext";
import ButtonPrimary from "../components/ButtonPrimary";
import { submitAudit } from "../utils/api";

const FieldLabel = ({ children, required }) => (
  <label className="block text-[10px] font-semibold tracking-widest uppercase text-audit-neutral mb-1.5">
    {children}
    {required && <span className="text-audit-negative ml-1">*</span>}
  </label>
);

const TextInput = ({
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className="w-full px-4 !py-4 rounded-opt border !border-[#56B7FF] bg-brand-cream text-brand-black text-sm placeholder:text-audit-neutral focus:outline-none focus:border-transparent focus:ring-1 focus:ring-step-border-active mb-4 transition-colors disabled:opacity-50"
  />
);

const SelectInput = ({ value, onChange, disabled, children }) => (
  <select
    value={value}
    onChange={onChange}
    disabled={disabled}
    className="w-full border border-[#56B7FF] bg-brand-cream text-brand-black text-sm focus:outline-none focus:border-transparent focus:ring-1 focus:ring-step-border-active mb-4 transition-colors disabled:opacity-50 appearance-none cursor-pointer"
  >
    {children}
  </select>
);

const Step8_Capture = () => {
  const { state, update, goTo } = useAudit();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);

  const phoneValid = state.leadPhone.trim().length >= 7;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.leadEmail);
  const goalValid = !!state.leadGoal && state.leadGoal !== "";

  const isValid =
    state.leadName.trim() &&
    emailValid &&
    phoneValid &&
    goalValid &&
    smsConsent;

  const handleSubmit = async () => {
    if (!isValid) return;
    setError("");
    setSubmitting(true);

    try {
      await submitAudit({
        name: state.leadName.trim(),
        email: state.leadEmail.trim(),
        phone: state.leadPhone.trim(),
        smsConsent: true,
        audit: {
          ...state.auditResults,
          resultsUrl: state.resultsUrl ?? "",
          goal: state.goal,
          leadGoal: state.leadGoal,
          condition: state.condition,
          currentUse: state.currentUse,
          address: state.address,
          property: state.property,
        },
      });
      setDone(true);
    } catch (err) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success / Thank-you state ─────────────────────────────────────────────
  if (done) {
    return (
      <div className="p-6 text-center py-14">
        {/* Check icon */}
        <div className="w-16 h-16 rounded-full bg-audit-positive/10 flex items-center justify-center mx-auto mb-5 border-2 border-audit-positive/25">
          <svg
            className="w-8 h-8 text-audit-positive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-bold text-brand-black mb-2">
          Your Property Audit Is In Progress
        </h2>

        {/* Sub-copy — email only, NO SMS mention */}
        <p className="text-sm text-audit-neutral mb-6 max-w-sm mx-auto leading-relaxed">
          We'll be in touch shortly with your results and next steps. If you
          want to move faster,{" "}
          <a
            href="https://rentalrescuepm.com/contact"
            className="text-brand-gold font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            book a call below
          </a>
          .
        </p>

        {/* Sent-to confirmation — email only */}
        <div className="bg-step-bg border border-step-border rounded-opt px-5 py-3 inline-block">
          <p className="text-[11px] text-audit-neutral mb-0.5">Audit sent to</p>
          <p className="text-sm font-semibold text-brand-black">
            {state.leadEmail}
          </p>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-8 md:p-12">
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
        We'll send you a personalised execution roadmap rental model, pricing,
        and exact next steps.
      </p>

      <FieldLabel required>Full name</FieldLabel>
      <TextInput
        value={state.leadName}
        onChange={(e) => update({ leadName: e.target.value })}
        placeholder="Your full name"
        disabled={submitting}
      />

      <FieldLabel required>Email address</FieldLabel>
      <TextInput
        type="email"
        value={state.leadEmail}
        onChange={(e) => update({ leadEmail: e.target.value })}
        placeholder="you@email.com"
        disabled={submitting}
      />

      <FieldLabel required>What are you looking to do?</FieldLabel>
      <div className="relative mb-0">
        <SelectInput
          value={state.leadGoal ?? ""}
          onChange={(e) => update({ leadGoal: e.target.value })}
          disabled={submitting}
        >
          <option value="" disabled>
            Select your goal…
          </option>
          <option value="increase_cashflow">Increase cash flow</option>
          <option value="sell_property">Sell the property</option>
          <option value="not_sure">Not sure yet</option>
        </SelectInput>
      </div>

      <FieldLabel required>Phone number</FieldLabel>
      <TextInput
        type="tel"
        value={state.leadPhone}
        onChange={(e) => update({ leadPhone: e.target.value })}
        placeholder="+1 (555) 000-0000"
        disabled={submitting}
      />

      {/* ── RingCentral compliance block ─────────────────────────────────── */}
      <div className="mb-0">
        <p className="text-[11px] text-audit-neutral mb-3 leading-relaxed">
          🔒{" "}
          <span className="font-semibold text-brand-black">
            Your information is safe and will never be shared.
          </span>{" "}
          No spam. Just data.
        </p>

        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={smsConsent}
              onChange={(e) => setSmsConsent(e.target.checked)}
              disabled={submitting}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                smsConsent
                  ? "bg-brand-gold border-brand-gold"
                  : "bg-white border-step-border group-hover:border-step-border-active"
              }`}
            >
              {smsConsent && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>

          <p className="text-[13px] mb-1 text-audit-neutral leading-relaxed">
            By submitting this form, you agree to receive text messages from{" "}
            <span className="font-semibold text-brand-black">
              Rental Rescue Property Management
            </span>{" "}
            regarding your property analysis, account updates, appointment
            reminders, and service-related communications. Message frequency may
            vary. Message and data rates may apply. Reply{" "}
            <span className="font-semibold">STOP</span> to opt out or{" "}
            <span className="font-semibold">HELP</span> for assistance. View our{" "}
            <a
              href="https://rentalrescuepm.com/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gold underline underline-offset-1 hover:opacity-75 transition-opacity"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://rentalrescuepm.com/terms-of-service/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gold underline underline-offset-1 hover:opacity-75 transition-opacity"
            >
              Terms of Service
            </a>
            .
          </p>
        </label>
      </div>
      {/* ── End compliance block ─────────────────────────────────────────── */}

      {error && <p className="text-xs text-audit-negative mb-3">{error}</p>}

      {!isValid && !submitting && (
        <p className="text-start text-[10px] mb-1 text-audit-negative mt-2 leading-relaxed">
          {!smsConsent
            ? "Please agree to SMS communications above to continue."
            : "Please fill in all required fields to continue."}
        </p>
      )}

      <ButtonPrimary
        onClick={handleSubmit}
        disabled={!isValid || submitting}
        variant="gold"
      >
        {submitting ? "Sending…" : "Get My Cash Flow Audit →"}
      </ButtonPrimary>
    </div>
  );
};

export default Step8_Capture;
