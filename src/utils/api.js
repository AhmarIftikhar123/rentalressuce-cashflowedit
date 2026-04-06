/**
 * api.js
 * All external fetch calls in one place.
 *
 * PROPERTY LOOKUP
 * ---------------
 * Option A (Zillow / BridgeDataOutput):
 *   Requires a paid API key. Returns beds, baths, sqft, zestimate.
 *   Uncomment the Zillow block below when ready.
 *
 * Option B (Google Places Autocomplete — address only):
 *   Use Google Places JS SDK for the autocomplete input.
 *   Google does NOT return beds/baths/sqft — user fills those in Step 1b (Edit).
 *   Uncomment the Google block if you go this route.
 *
 * For now: returns hardcoded dummy data so every step works immediately.
 */

// ─── DUMMY PROPERTY (remove when real API is wired) ───────────────────────────
const DUMMY_PROPERTY = {
  beds:     '4',
  baths:    '3',
  sqft:     '2,000–3,000',
  garage:   'Detached',
  attic:    'Finished',
  estValue: 420000,
};
// ──────────────────────────────────────────────────────────────────────────────

/**
 * lookupProperty(address)
 * Returns property data for the given address string.
 * Swap the body of this function when a real API is available.
 */
export async function lookupProperty(address) {
  // ── DUMMY — always returns mock data ──────────────────────────────────────
  await new Promise((r) => setTimeout(r, 900)); // simulate network delay
  return { ...DUMMY_PROPERTY };
  // ──────────────────────────────────────────────────────────────────────────

  // ── OPTION A: Zillow / BridgeDataOutput ───────────────────────────────────
  // const API_KEY = 'YOUR_BRIDGE_DATA_API_KEY';
  // const encoded = encodeURIComponent(address);
  // const res = await fetch(
  //   `https://api.bridgedataoutput.com/api/v2/zestimates?access_token=${API_KEY}&address=${encoded}`
  // );
  // const json = await res.json();
  // const hit  = json?.bundle?.[0];
  // if (!hit) throw new Error('Property not found');
  // return {
  //   beds:     String(hit.BedroomsTotal ?? 3),
  //   baths:    String(hit.BathroomsTotalInteger ?? 2),
  //   sqft:     sqftBucket(hit.LivingArea),
  //   garage:   hit.GarageSpaces > 0 ? 'Attached' : 'No',
  //   attic:    'Not sure',
  //   estValue: hit.zestimate ?? 400000,
  // };
  // ──────────────────────────────────────────────────────────────────────────

  // ── OPTION B: Google Places (address autocomplete only) ───────────────────
  // Google Places does NOT return beds/baths/sqft.
  // Use the Google Places JS SDK in Step0_Address.jsx for the autocomplete UI.
  // After the user picks an address, call this function with the formatted address.
  // Since Google gives no property data, skip pre-fill and go directly to Step 1b.
  //
  // const res = await fetch(
  //   `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=YOUR_GOOGLE_KEY`
  // );
  // const json = await res.json();
  // if (!json.results?.length) throw new Error('Address not found');
  // // Return null so App.js routes to Step1b (edit) instead of Step1 (confirm)
  // return null;
  // ──────────────────────────────────────────────────────────────────────────
}

// ── Helper: map raw sqft number to bucket string ──────────────────────────────
// eslint-disable-next-line no-unused-vars
function sqftBucket(sqft) {
  if (!sqft) return '1,500–2,000';
  if (sqft < 1000)  return 'Under 1,000';
  if (sqft < 1500)  return '1,000–1,500';
  if (sqft < 2000)  return '1,500–2,000';
  if (sqft < 3000)  return '2,000–3,000';
  return '3,000+';
}

/**
 * submitAudit(payload)
 * Posts lead + audit results to the WP REST endpoint,
 * which forwards to FluentCRM.
 *
 * Requires wp_localize_script to expose window.rentalAuditConfig.
 */
export async function submitAudit(payload) {
  const config  = window?.rentalAuditConfig ?? {};
  const restUrl = config.restUrl ?? '/wp-json/rental-audit/v1/';
  const nonce   = config.nonce   ?? '';

  const res = await fetch(`${restUrl}submit`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce':   nonce,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? 'Submission failed. Please try again.');
  }

  return res.json();
}
