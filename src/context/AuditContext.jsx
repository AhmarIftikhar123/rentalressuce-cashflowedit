import { createContext, useContext, useState } from "@wordpress/element";

/**
 * AuditContext
 * Single source of truth for the entire 9-step form.
 * Every step reads from and writes to this context.
 */

const AuditContext = createContext(null);

const INITIAL_STATE = {
  // Navigation
  step: 0, // 0=address, 1=confirm, 1.5=edit, 2=condition, 3=usage
  // 4=piti, 5=loan, 6=goal, 7=results, 8=capture

  // Step 0
  address: "",
  addressLoading: false,
  addressError: "",

  // Step 1 — property data populated from RentCast via WP REST
  property: {
    beds: "",
    baths: "",
    sqft: "",
    garage: "", // RentCast does not provide — user fills in Step 1b
    attic: "", // RentCast does not provide — user fills in Step 1b
    estValue: 0,
    rentEstimate: 0, // ← RentCast LTR baseline; drives all multipliers in calculations.js
  },

  // Step 2
  condition: "",

  // Step 3
  currentUse: "",

  // Step 4 — stored as numeric midpoint
  piti: 0,

  // Step 5 — stored as numeric midpoint
  loanBalance: 0,

  // Step 6
  goal: "",

  // Step 8 — lead capture
  leadName: "",
  leadEmail: "",
  leadPhone: "",
  leadGoal: "",
  // Computed results (set after Step 6)
  auditResults: null,

  // Shareable URL for the admin results viewer (set alongside auditResults in Step 6)
  resultsUrl: "",
};

export function AuditProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);

  /** Merge partial updates */
  const update = (partial) => setState((prev) => ({ ...prev, ...partial }));

  /** Navigate to a step */
  const goTo = (step) => setState((prev) => ({ ...prev, step }));

  /** Reset everything */
  const reset = () => setState(INITIAL_STATE);

  return (
    <AuditContext.Provider value={{ state, update, goTo, reset }}>
      {children}
    </AuditContext.Provider>
  );
}

/** Hook — use inside any step component */
export function useAudit() {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error("useAudit must be used inside <AuditProvider>");
  return ctx;
}
