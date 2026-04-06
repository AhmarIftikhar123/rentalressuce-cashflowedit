<?php
// ── FluentCRM integration ─────────────────────────────────────────────────────
function rental_audit_save_to_fluentcrm( $name, $email, $phone, $audit ) {

    // Guard: FluentCRM must be active
    if ( ! function_exists( 'FluentCrmApi' ) ) {
        error_log( 'Rental Audit: FluentCRM not active.' );
        return;
    }

    $contact_api = FluentCrmApi( 'contacts' );

    $name_parts = explode( ' ', $name, 2 );
    $first_name = $name_parts[0] ?? '';
    $last_name  = $name_parts[1] ?? '';

    /**
     * FluentCRM list IDs — update these after creating your list in CRM dashboard.
     * Admin → CRM → Lists → Create "Rental Audit Leads" → note the ID.
     */
    $list_ids = [ 1 ]; // ← replace with your real list ID

    /**
     * FluentCRM tag IDs — update after creating tags in CRM dashboard.
     * Suggest creating: "rental-audit", "goal-{goal}", "audit-lead"
     */
    $tag_ids = [ 1 ]; // ← replace with your real tag ID

    $contact_data = [
        'email'      => $email,
        'first_name' => $first_name,
        'last_name'  => $last_name,
        'phone'      => $phone,
        'lists'      => $list_ids,
        'tags'       => $tag_ids,
        'status'     => 'subscribed',

        // Custom fields — create these in FluentCRM → Custom Fields first
        'custom_values' => [
            'property_value'  => $audit['val']        ?? 0,
            'monthly_upside'  => $audit['upside']     ?? 0,
            'equity_pct'      => $audit['equityPct']  ?? 0,
            'goal'            => $audit['goal']        ?? '',
            'condition'       => $audit['condition']   ?? '',
            'current_use'     => $audit['currentUse'] ?? '',
            'ltr_income'      => $audit['baseLTR']    ?? 0,
            'mtr_income'      => $audit['baseMTR']    ?? 0,
            'str_income'      => $audit['baseSTR']    ?? 0,
            'ltr_cashflow'    => $audit['ltr_cf']     ?? 0,
            'str_cashflow'    => $audit['str_cf']     ?? 0,
        ],
    ];

    $contact = $contact_api->createOrUpdate( $contact_data );

    if ( is_wp_error( $contact ) ) {
        error_log( 'Rental Audit: FluentCRM error — ' . $contact->get_error_message() );
    }
}
