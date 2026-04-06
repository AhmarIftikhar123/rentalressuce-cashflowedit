<?php
/**
 * Template Name: Cashflow Calculator
 *
 * In WP Admin → Pages → (your page) → Page Attributes → Template → Cashflow Calculator.
 *
 * The React app mounts on #react-root.
 * functions.php enqueues the build/index.js only when this template is active.
 */

get_header();
?>

<main id="calculator-page" style="padding:0; margin:0;">
  <div id="react-root"></div>
</main>

<?php
get_footer();
?>
