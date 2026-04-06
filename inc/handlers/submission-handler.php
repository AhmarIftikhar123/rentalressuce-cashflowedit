<?php
// ── 4. Handle submission ──────────────────────────────────────────────────────
function rental_audit_handle_submission( WP_REST_Request $request ) {

    // Validate nonce
    $nonce = $request->get_header( 'X-WP-Nonce' );
    if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
        return new WP_Error( 'forbidden', 'Invalid nonce.', [ 'status' => 403 ] );
    }

    $body  = $request->get_json_params();
    $name  = sanitize_text_field( $body['name']  ?? '' );
    $email = sanitize_email( $body['email']       ?? '' );
    $phone = sanitize_text_field( $body['phone']  ?? '' );
    $audit = $body['audit'] ?? [];

    if ( ! $name || ! is_email( $email ) ) {
        return new WP_Error( 'invalid_data', 'Name and valid email are required.', [ 'status' => 400 ] );
    }

    // a) Save to FluentCRM
    rental_audit_save_to_fluentcrm( $name, $email, $phone, $audit );

    // b) Email to lead
    rental_audit_email_lead( $name, $email, $audit );

    // c) Email to admin
    rental_audit_email_admin( $name, $email, $phone, $audit );

    return rest_ensure_response( [ 'success' => true ] );
}
