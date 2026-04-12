<?php
// ── Helper: Get results viewer page URL ───────────────────────────────────────
function rental_audit_get_results_page_url() {
    $page = get_page_by_path( 'rental-audit-results' );
    return $page ? get_permalink( $page->ID ) : home_url( '/rental-audit-results/' );
}

// ── 1 & 2. Enqueue scripts ────────────────────────────────────────────────────
add_action( 'wp_enqueue_scripts', function () {

    // Parent Blocksy styles
    wp_enqueue_style(
        'blocksy-style',
        get_template_directory_uri() . '/style.css',
        [],
        wp_get_theme( 'blocksy' )->get( 'Version' )
    );

    // Enqueue dashicons for the frontend
    wp_enqueue_style( 'dashicons' );

    // Only load React app on the calculator or results viewer page templates
    if ( ! is_page_template( 'page-calculator.php' ) && ! is_page_template( 'page-results-viewer.php' ) ) {
        return;
    }

    $asset_path  = get_stylesheet_directory() . '/build/index.asset.php';
    $deps        = [ 'wp-element' ];
    $version     = wp_get_theme()->get( 'Version' );

    if ( file_exists( $asset_path ) ) {
        $asset   = include $asset_path;
        $deps    = $asset['dependencies'];
        $version = $asset['version'];
    }

    wp_enqueue_script(
        'rental-audit-app',
        get_stylesheet_directory_uri() . '/build/index.js',
        $deps,
        $version,
        true
    );

    wp_enqueue_style(
        'rental-audit-styles',
        get_stylesheet_directory_uri() . '/build/style-index.css',
        [ 'blocksy-style' ],
        $version
    );

    // Pass config to React via window.rentalAuditConfig
    // This is the SINGLE source of truth — plugin no longer duplicates this.
    wp_localize_script( 'rental-audit-app', 'rentalAuditConfig', [
        'restUrl'        => rest_url( 'rental-audit/v1/' ),
        'nonce'          => wp_create_nonce( 'wp_rest' ),
        'siteUrl'        => get_site_url(),
        'isAdmin'        => current_user_can( 'manage_options' ),
        'resultsPageUrl' => rental_audit_get_results_page_url(),
    ] );

} );
