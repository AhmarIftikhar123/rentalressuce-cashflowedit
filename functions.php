<?php
/**
 * functions.php — Blocksy Child Theme
 *
 * Responsibilities are modularized in the /inc directory.
 */

// Define child theme path constants if needed in the future
define( 'BLOCKSY_CHILD_INC_DIR', get_stylesheet_directory() . '/inc' );

$files_to_include = [
    '/enqueue.php',
    '/api.php',
    '/services/fluentcrm.php',
    '/services/mailer.php',
    '/handlers/submission-handler.php',
];

foreach ( $files_to_include as $file ) {
    $filepath = BLOCKSY_CHILD_INC_DIR . $file;
    if ( file_exists( $filepath ) ) {
        require_once $filepath;
    } else {
        error_log( "Blocksy Child Error: Failed to load $filepath" );
    }
}
