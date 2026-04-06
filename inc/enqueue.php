<?php
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

    // Only load React app on the calculator page template
    if ( ! is_page_template( 'page-calculator.php' ) ) {
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
    wp_localize_script( 'rental-audit-app', 'rentalAuditConfig', [
        'restUrl' => rest_url( 'rental-audit/v1/' ),
        'nonce'   => wp_create_nonce( 'wp_rest' ),
        'siteUrl' => get_site_url(),
    ] );

} );
