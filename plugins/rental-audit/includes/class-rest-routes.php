<?php
/**
 * Class Rental_Audit_Rest_Routes
 *
 * Registers WP REST API endpoints for the Rental Rescue audit tool.
 *
 * Endpoints:
 *   POST /wp-json/rental-audit/v1/lookup  — RentCast property lookup
 *   POST /wp-json/rental-audit/v1/submit  — Lead capture → FluentCRM
 */
class Rental_Audit_Rest_Routes {

    const NAMESPACE = 'rental-audit/v1';

    public static function init() {
        add_action( 'rest_api_init', [ __CLASS__, 'register_routes' ] );
    }

    public static function register_routes() {

        // ── POST /wp-json/rental-audit/v1/lookup ────────────────────────
        register_rest_route( self::NAMESPACE, '/lookup', [
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => [ __CLASS__, 'handle_lookup' ],
            'permission_callback' => [ __CLASS__, 'check_nonce' ],
            'args'                => [
                'address' => [
                    'required'          => true,
                    'type'              => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function( $val ) {
                        return ! empty( trim( $val ) );
                    },
                ],
            ],
        ] );

        // ── POST /wp-json/rental-audit/v1/submit ────────────────────────
        register_rest_route( self::NAMESPACE, '/submit', [
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => [ __CLASS__, 'handle_submit' ],
            'permission_callback' => [ __CLASS__, 'check_nonce' ],
            'args'                => [
                'name' => [
                    'required'          => true,
                    'type'              => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'email' => [
                    'required'          => true,
                    'type'              => 'string',
                    'sanitize_callback' => 'sanitize_email',
                    'validate_callback' => function( $val ) {
                        return is_email( $val );
                    },
                ],
                'phone' => [
                    'required'          => false,
                    'type'              => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'audit' => [
                    'required' => true,
                    'type'     => 'object',
                ],
            ],
        ] );
    }

    /**
     * Verify the WP nonce sent in the X-WP-Nonce header.
     * The nonce is exposed via wp_localize_script as rentalAuditConfig.nonce.
     */
    public static function check_nonce( WP_REST_Request $request ) {
        $nonce = $request->get_header( 'X-WP-Nonce' );
        if ( ! $nonce || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
            return new WP_Error( 'invalid_nonce', 'Security check failed.', [ 'status' => 403 ] );
        }
        return true;
    }

    /**
     * Handle POST /wp-json/rental-audit/v1/lookup
     */
    public static function handle_lookup( WP_REST_Request $request ) {
        $address = $request->get_param( 'address' );

        $result = Rentcast_API::lookup( $address );

        if ( is_wp_error( $result ) ) {
            return new WP_REST_Response(
                [ 'message' => $result->get_error_message() ],
                404
            );
        }

        return new WP_REST_Response( $result, 200 );
    }

    /**
     * Handle POST /wp-json/rental-audit/v1/submit
     * Delegates to Rental_Audit_FluentCRM_Submit::handle()
     */
    public static function handle_submit( WP_REST_Request $request ) {
        return Rental_Audit_FluentCRM_Submit::handle( $request );
    }
}