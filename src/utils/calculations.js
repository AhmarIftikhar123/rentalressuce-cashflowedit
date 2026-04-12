/**
 * calculations.js
 * Pure functions — no React, no side effects.
 * All formulas for the Rental Rescue Cashflow Audit.
 *
 * V1 Multiplier logic (client-specified, fixed for V1):
 *   LTR  = RentCast estimated rent × condition multiplier
 *   MTR  = LTR × 1.5
 *   STR  = LTR × 1.8
 *   Sec8 = LTR × 1.1
 *   Room = LTR × 1.3
 *
 * If rentEstimate is 0 (RentCast call failed / not available),
 * falls back to the formula-based estimate so the app never breaks.
 */

// ─── Condition multiplier ─────────────────────────────────────────────────────

/**
 * Applied on top of the RentCast LTR baseline to reflect property condition.
 * RentCast gives a market average; condition adjusts for the specific property state.
 */
export function getConditionMultiplier( condition ) {
  const map = {
    'needs-work':      0.85,
    'rent-ready':      1.00,
    'updated':         1.08,
    'fully-renovated': 1.15,
  };
  return map[ condition ] ?? 1.0;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Derive sq ft midpoint from the bucket string (fallback estimator only). */
export function getSqftMidpoint( sqft ) {
  const map = {
    'Under 1,000': 800,
    '1,000–1,500': 1250,
    '1,500–2,000': 1750,
    '2,000–3,000': 2500,
    '3,000+':      3500,
  };
  return map[ sqft ] ?? 2000;
}

/** Parse beds string → number. Handles '5+' → 5. */
export function parseBeds( beds ) {
  if ( typeof beds === 'number' ) return beds;
  return parseInt( String( beds ).replace( '+', '' ) ) || 3;
}

// ─── Core rent estimator ──────────────────────────────────────────────────────

/**
 * calcRentEstimates(property, condition)
 *
 * Primary path  — uses property.rentEstimate (from RentCast) as the LTR baseline.
 * Fallback path — if rentEstimate is 0/missing, derives LTR from estValue + sqft + beds
 *                 so the app stays functional even if the RentCast call fails.
 *
 * All values rounded to nearest $50 for clean UI display.
 */
export function calcRentEstimates( property, condition ) {
  const { estValue, beds, sqft, rentEstimate } = property;
  const cm      = getConditionMultiplier( condition );
  const bedsNum = parseBeds( beds );

  // ── Determine LTR baseline ────────────────────────────────────────────────
  let rawLTR;

  if ( rentEstimate && rentEstimate > 0 ) {
    // PRIMARY: RentCast gave us a real market rent — use it directly.
    rawLTR = rentEstimate * cm;
  } else {
    // FALLBACK: Formula-based estimate (same as original V0 logic).
    const sqftMid = getSqftMidpoint( sqft );
    rawLTR = ( estValue * 0.007 + bedsNum * 80 + sqftMid * 0.05 ) * cm;
  }

  // Round to nearest $50
  const baseLTR = Math.round( rawLTR / 50 ) * 50;

  // ── Apply client-specified V1 multipliers ─────────────────────────────────
  const baseMTR  = Math.round( ( baseLTR * 1.5 ) / 50 ) * 50;  // Mid-term
  const baseSTR  = Math.round( ( baseLTR * 1.8  ) / 50 ) * 50;  // Short-term
  const baseSec8 = Math.round( ( baseLTR * 1.1  ) / 50 ) * 50;  // Section 8
  const baseRoom = Math.round( ( baseLTR * 1.3  ) / 50 ) * 50;  // By-the-room

  return { baseLTR, baseMTR, baseSTR, baseSec8, baseRoom };
}

// ─── Equity ───────────────────────────────────────────────────────────────────

export function calcEquity( estValue, loanBalance ) {
  const equity    = estValue - loanBalance;
  const equityPct = Math.round( ( equity / estValue ) * 100 );
  return { equity, equityPct };
}

// ─── Cash flow ────────────────────────────────────────────────────────────────

/**
 * Cash flow = rental income − PITI for each strategy.
 */
export function calcCashFlow( rents, piti ) {
  return {
    ltr_cf:  rents.baseLTR  - piti,
    mtr_cf:  rents.baseMTR  - piti,
    str_cf:  rents.baseSTR  - piti,
    sec8_cf: rents.baseSec8 - piti,
    room_cf: rents.baseRoom - piti,
  };
}

// ─── Upside ───────────────────────────────────────────────────────────────────

/**
 * Upside = best strategy (STR) vs baseline (LTR).
 * This is the headline number shown in Step 7.
 */
export function calcUpside( rents ) {
  return rents.baseSTR - rents.baseLTR;
}

// ─── Master calc ──────────────────────────────────────────────────────────────

/**
 * runAuditCalc(auditState)
 * Call once with full context state → returns complete result object for Step 7.
 */
export function runAuditCalc( auditState ) {
  const { property, condition, piti, loanBalance } = auditState;

  const rents    = calcRentEstimates( property, condition );
  const cashflow = calcCashFlow( rents, piti );
  const eq       = calcEquity( property.estValue, loanBalance );
  const upside   = calcUpside( rents );

  return {
    ...rents,
    ...cashflow,
    ...eq,
    upside,
    piti,
    val:         property.estValue,
    loanBalance,
    usedRentCast: !! ( property.rentEstimate && property.rentEstimate > 0 ),
  };
}

// ─── Formatters ───────────────────────────────────────────────────────────────

/** Format number as USD — e.g. 2500 → "$2,500" */
export function fmtMoney( n ) {
  if ( n == null ) return '—';
  const abs       = Math.abs( n );
  const formatted = abs.toLocaleString( 'en-US' );
  return n < 0 ? `-$${formatted}` : `$${formatted}`;
}

/** Format as USD/mo */
export function fmtMonthly( n ) {
  return `${fmtMoney( n )}/mo`;
}
