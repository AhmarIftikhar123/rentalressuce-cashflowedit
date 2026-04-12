<?php
/**
 * Template Name: Rental Audit Results Viewer
 *
 * Admin-only page template for viewing audit results.
 *
 * Setup:
 *   1. WP Admin → Pages → Add New
 *   2. Title: "Rental Audit Results" (or anything)
 *   3. Slug: rental-audit-results
 *   4. Page Attributes → Template → Rental Audit Results Viewer
 *   5. Publish
 *
 * The React component (ResultsViewer.jsx) mounts on
 * #rental-audit-results-viewer and performs a second client-side
 * admin check using window.rentalAuditConfig.isAdmin.
 */

// ── Server-side admin guard ───────────────────────────────────────────────────
if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
    wp_redirect( wp_login_url( get_permalink() ) );
    exit;
}

get_header();
?>

<main id="results-viewer-page" style="padding:0; margin:0;">
  <div id="rental-audit-results-viewer"></div>
</main>

<?php
get_footer();
?>
