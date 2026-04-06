/**
 * calculations.js
 * Pure functions — no React, no side effects.
 * All formulas for the Rental Rescue Cashflow Audit.
 */

/**
 * Condition multiplier applied to every rent estimate.
 * Reflects how property condition affects achievable rent.
 */
export function getConditionMultiplier(condition) {
  const map = {
    'needs-work':      0.85,
    'rent-ready':      1.00,
    'updated':         1.08,
    'fully-renovated': 1.15,
  };
  return map[condition] ?? 1.0;
}

/**
 * Derive a sq ft midpoint from the bucket string.
 */
export function getSqftMidpoint(sqft) {
  const map = {
    'Under 1,000':  800,
    '1,000–1,500':  1250,
    '1,500–2,000':  1750,
    '2,000–3,000':  2500,
    '3,000+':       3500,
  };
  return map[sqft] ?? 2000;
}

/**
 * Parse beds — handles '5+' → 5
 */
export function parseBeds(beds) {
  if (typeof beds === 'number') return beds;
  return parseInt(String(beds).replace('+', '')) || 3;
}

/**
 * Core rent estimator.
 * Formula: (estValue × 0.007 + beds × $80 + sqftMid × $0.05) × conditionMultiplier
 * Rounded to nearest $50.
 *
 * LTR → MTR: ×1.35
 * LTR → STR: ×1.80
 */
export function calcRentEstimates(property, condition) {
  const { estValue, beds, sqft } = property;
  const cm       = getConditionMultiplier(condition);
  const sqftMid  = getSqftMidpoint(sqft);
  const bedsNum  = parseBeds(beds);

  const rawLTR  = (estValue * 0.007 + bedsNum * 80 + sqftMid * 0.05) * cm;
  const baseLTR = Math.round(rawLTR / 50) * 50;
  const baseMTR = Math.round((baseLTR * 1.35) / 50) * 50;
  const baseSTR = Math.round((baseLTR * 1.80) / 50) * 50;

  return { baseLTR, baseMTR, baseSTR };
}

/**
 * Equity calculation.
 */
export function calcEquity(estValue, loanBalance) {
  const equity    = estValue - loanBalance;
  const equityPct = Math.round((equity / estValue) * 100);
  return { equity, equityPct };
}

/**
 * Cash flow calculations.
 */
export function calcCashFlow(rents, piti) {
  return {
    ltr_cf: rents.baseLTR - piti,
    mtr_cf: rents.baseMTR - piti,
    str_cf: rents.baseSTR - piti,
  };
}

/**
 * Upside — monthly income being left on the table vs current best.
 * "Best current" is LTR for most use cases.
 */
export function calcUpside(rents) {
  return rents.baseSTR - rents.baseLTR;
}

/**
 * Master calc — call this once with all audit state to get the full result object.
 */
export function runAuditCalc(auditState) {
  const { property, condition, piti, loanBalance } = auditState;

  const rents    = calcRentEstimates(property, condition);
  const cashflow = calcCashFlow(rents, piti);
  const eq       = calcEquity(property.estValue, loanBalance);
  const upside   = calcUpside(rents);

  return {
    ...rents,
    ...cashflow,
    ...eq,
    upside,
    piti,
    val: property.estValue,
    loanBalance,
  };
}

/**
 * Format a number as USD — e.g. 2500 → "$2,500"
 */
export function fmtMoney(n) {
  if (n == null) return '—';
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString('en-US');
  return n < 0 ? `-$${formatted}` : `$${formatted}`;
}

/**
 * Format as USD per month
 */
export function fmtMonthly(n) {
  return `${fmtMoney(n)}/mo`;
}
