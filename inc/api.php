<?php
// ── 3. Register REST endpoint ─────────────────────────────────────────────────
add_action( 'rest_api_init', function () {
    register_rest_route( 'rental-audit/v1', '/submit', [
        'methods'             => 'POST',
        'callback'            => 'rental_audit_handle_submission',
        'permission_callback' => '__return_true', // Public — nonce validated inside
    ] );
} );
