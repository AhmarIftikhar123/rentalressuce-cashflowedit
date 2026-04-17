<?php
/**
 * Plugin Name: Rental Audit – RentCast Integration
 * Description: Registers the /lookup and /submit REST endpoints, RentCast API,
 *              FluentCRM lead capture with custom fields, and the admin results viewer.
 * Version:     1.2.0
 *
 * HOW TO CONFIGURE:
 * Add this line to wp-config.php (before "That's all, stop editing!"):
 *   define( 'RENTCAST_API_KEY', 'your_rentcast_api_key_here' );
 *
 * RESULTS VIEWER SETUP:
 * 1. Create a WordPress page with the slug: rental-audit-results
 * 2. Assign it the page template: "Rental Audit Results Viewer"
 *    (registered below via the 'theme_page_templates' filter)
 * 3. The page is automatically restricted to logged-in admins.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ── Load classes ──────────────────────────────────────────────────────────────
require_once plugin_dir_path( __FILE__ ) . 'includes/class-rentcast-api.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/class-fluentcrm-submit.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/class-rest-routes.php';

// ── Boot REST routes ──────────────────────────────────────────────────────────
Rental_Audit_Rest_Routes::init();

// ── NOTE ──────────────────────────────────────────────────────────────────────
// wp_localize_script for 'rentalAuditConfig' is handled by the theme's
// enqueue.php (single source of truth). Results viewer page template lives
// in the theme as page-results-viewer.php.