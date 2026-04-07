/**
 * api.js
 * All external fetch calls in one place.
 *
 * lookupProperty() now calls the WordPress REST endpoint /wp-json/rental-audit/v1/lookup
 * which proxies to the RentCast API server-side (API key stays safely in wp-config.php).
 *
 * The endpoint returns:
 *   { beds, baths, sqft, estValue, rentEstimate, garage: '', attic: '' }
 *
 * garage and attic are always blank from RentCast — the user fills them in Step 1b.
 */

/**
 * lookupProperty(address)
 * POSTs to the WP REST lookup endpoint.
 * Returns property data shape expected by AuditContext / Step1_Confirm.
 *
 * Throws an Error with a user-friendly message on failure.
 */
export async function lookupProperty( address ) {
  const config  = window?.rentalAuditConfig ?? {};
  const restUrl = config.restUrl ?? '/wp-json/rental-audit/v1/';
  const nonce   = config.nonce   ?? '';

  const res = await fetch( `${restUrl}lookup`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce':   nonce,
    },
    body: JSON.stringify( { address } ),
  } );

  const data = await res.json().catch( () => ( {} ) );

  if ( ! res.ok ) {
    throw new Error(
      data?.message ?? 'Could not find that address. Please check it and try again.'
    );
  }

  return data; // { beds, baths, sqft, estValue, rentEstimate, garage:'', attic:'' }
}

/**
 * submitAudit(payload)
 * Posts lead + audit results to the WP REST endpoint → FluentCRM.
 * (Unchanged — existing endpoint handles this.)
 */
export async function submitAudit( payload ) {
  const config  = window?.rentalAuditConfig ?? {};
  const restUrl = config.restUrl ?? '/wp-json/rental-audit/v1/';
  const nonce   = config.nonce   ?? '';

  const res = await fetch( `${restUrl}submit`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce':   nonce,
    },
    body: JSON.stringify( payload ),
  } );

  if ( ! res.ok ) {
    const err = await res.json().catch( () => ( {} ) );
    throw new Error( err?.message ?? 'Submission failed. Please try again.' );
  }

  return res.json();
}