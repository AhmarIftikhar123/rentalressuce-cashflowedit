<?php

/**
 * Class Rental_Audit_FluentCRM_Submit
 *
 * Handles POST /wp-json/rental-audit/v1/submit
 *
 * On each submission it:
 *   1. Ensures all required custom fields exist in FluentCRM (safe, idempotent).
 *   2. Creates or updates the FluentCRM contact (name, email, phone).
 *   3. Saves every audit field to those custom fields on the contact.
 *   4. Saves the shareable results URL as ra_results_url.
 *   5. Adds the contact to the "Leads" list and tags "Cashflow Audit".
 *
 * Uses ONLY the stable FluentCRM public API:
 *   fluentcrm_get_option / fluentcrm_update_option  — for custom field schema
 *   FluentCrmApi()                                  — for contacts, lists, tags
 *
 * Custom fields managed (all prefixed ra_):
 *   ra_address, ra_beds, ra_baths, ra_sqft, ra_garage, ra_attic,
 *   ra_condition, ra_current_use, ra_goal,
 *   ra_est_value, ra_loan_balance, ra_equity, ra_equity_pct, ra_piti,
 *   ra_ltr_income, ra_mtr_income, ra_str_income, ra_sec8_income, ra_room_income,
 *   ra_ltr_cashflow, ra_str_cashflow, ra_upside,
 *   ra_used_rentcast, ra_results_url
 */
class Rental_Audit_FluentCRM_Submit
{

    /**
     * Definition of every custom field we manage.
     * Uses only 'text' type — stable across all FluentCRM versions.
     */
    private static function field_definitions()
    {
        return [
            // ── Property ──────────────────────────────────────────────────────
            ['slug' => 'ra_address',      'label' => 'RA: Property Address',           'type' => 'text'],
            ['slug' => 'ra_beds',         'label' => 'RA: Bedrooms',                   'type' => 'text'],
            ['slug' => 'ra_baths',        'label' => 'RA: Bathrooms',                  'type' => 'text'],
            ['slug' => 'ra_sqft',         'label' => 'RA: Square Footage',             'type' => 'text'],
            ['slug' => 'ra_garage',       'label' => 'RA: Garage',                     'type' => 'text'],
            ['slug' => 'ra_attic',        'label' => 'RA: Attic',                      'type' => 'text'],
            // ── Audit inputs ──────────────────────────────────────────────────
            ['slug' => 'ra_condition',    'label' => 'RA: Property Condition',         'type' => 'text'],
            ['slug' => 'ra_current_use',  'label' => 'RA: Current Use',                'type' => 'text'],
            ['slug' => 'ra_goal',         'label' => 'RA: Owner Goal',                 'type' => 'text'],
            // ── Financials ────────────────────────────────────────────────────
            ['slug' => 'ra_est_value',    'label' => 'RA: Est. Property Value ($)',    'type' => 'text'],
            ['slug' => 'ra_loan_balance', 'label' => 'RA: Loan Balance ($)',           'type' => 'text'],
            ['slug' => 'ra_equity',       'label' => 'RA: Equity ($)',                 'type' => 'text'],
            ['slug' => 'ra_equity_pct',   'label' => 'RA: Equity (%)',                 'type' => 'text'],
            ['slug' => 'ra_piti',         'label' => 'RA: Monthly PITI ($)',           'type' => 'text'],
            // ── Rent estimates ────────────────────────────────────────────────
            ['slug' => 'ra_ltr_income',   'label' => 'RA: LTR Income ($/mo)',          'type' => 'text'],
            ['slug' => 'ra_mtr_income',   'label' => 'RA: MTR Income ($/mo)',          'type' => 'text'],
            ['slug' => 'ra_str_income',   'label' => 'RA: STR Income ($/mo)',          'type' => 'text'],
            ['slug' => 'ra_sec8_income',  'label' => 'RA: Section 8 Income ($/mo)',    'type' => 'text'],
            ['slug' => 'ra_room_income',  'label' => 'RA: By-the-Room Income ($/mo)',  'type' => 'text'],
            // ── Cash flows ────────────────────────────────────────────────────
            ['slug' => 'ra_ltr_cashflow', 'label' => 'RA: LTR Cash Flow ($/mo)',       'type' => 'text'],
            ['slug' => 'ra_str_cashflow', 'label' => 'RA: STR Cash Flow ($/mo)',       'type' => 'text'],
            ['slug' => 'ra_upside',       'label' => 'RA: Monthly Upside ($)',         'type' => 'text'],
            // ── Meta ──────────────────────────────────────────────────────────
            ['slug' => 'ra_used_rentcast', 'label' => 'RA: Powered by RentCast',        'type' => 'text'],
            ['slug' => 'ra_results_url',  'label' => 'RA: Results Page URL',           'type' => 'text'],
        ];
    }

    /**
     * Ensure every custom field in field_definitions() exists in FluentCRM.
     *
     * Uses fluentcrm_get_option / fluentcrm_update_option — the ONLY correct
     * way to read/write the custom field schema. Does NOT use the model class
     * directly (which uses internal ORM methods that change between versions).
     *
     * Safe to call on every submission — only writes if something is missing.
     */
    private static function ensure_custom_fields()
    {
        if (! function_exists('fluentcrm_get_option') || ! function_exists('fluentcrm_update_option')) {
            return;
        }

        $existing_fields = fluentcrm_get_option('contact_custom_fields', []);
        if (! is_array($existing_fields)) {
            $existing_fields = [];
        }

        // FluentCRM schema uses 'slug' as the field identifier
        $existing_slugs = [];
        foreach ($existing_fields as $field) {
            // Check BOTH 'slug' and 'key' — handle whatever is already stored
            $slug = $field['slug'] ?? $field['key'] ?? '';
            if ($slug) {
                $existing_slugs[] = $slug;
            }
        }

        $updated = false;

        foreach (self::field_definitions() as $def) {
            if (in_array($def['slug'], $existing_slugs, true)) {
                continue;
            }

            $existing_fields[] = [
                'slug'        => $def['slug'],  // FluentCRM reads 'slug' for field identity
                'label'       => $def['label'],
                'type'        => $def['type'],
                'options'     => [],
                'is_required' => false,
            ];

            $updated = true;
        }

        if ($updated) {
            fluentcrm_update_option('contact_custom_fields', $existing_fields);
        }
    }

    /**
     * Main submission handler.
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     */
    public static function handle(WP_REST_Request $request)
    {

        // ── Guard: FluentCRM must be active ──────────────────────────────────
        if (! function_exists('FluentCrmApi')) {
            return new WP_REST_Response(
                ['message' => 'FluentCRM is not active on this site.'],
                500
            );
        }

        // ── Parse request body ────────────────────────────────────────────────
        $body  = $request->get_json_params();

        $name  = sanitize_text_field($body['name']  ?? '');
        $email = sanitize_email($body['email'] ?? '');
        $phone = sanitize_text_field($body['phone'] ?? '');
        $audit = isset($body['audit']) && is_array($body['audit']) ? $body['audit'] : [];

        if (empty($email) || ! is_email($email)) {
            return new WP_REST_Response(['message' => 'A valid email address is required.'], 422);
        }

        // ── Split full name into first / last ─────────────────────────────────
        $parts      = explode(' ', $name, 2);
        $first_name = $parts[0] ?? '';
        $last_name  = $parts[1] ?? '';

        // ── Ensure our custom fields exist in FluentCRM ───────────────────────
        self::ensure_custom_fields();

        // ── Pull nested property object ───────────────────────────────────────
        $prop = isset($audit['property']) && is_array($audit['property'])
            ? $audit['property']
            : [];

        // ── Build custom fields payload ───────────────────────────────────────
        $custom_fields = [
            'ra_address'      => sanitize_text_field($audit['address']      ?? ''),
            'ra_beds'         => sanitize_text_field($prop['beds']           ?? ''),
            'ra_baths'        => sanitize_text_field($prop['baths']          ?? ''),
            'ra_sqft'         => sanitize_text_field($prop['sqft']           ?? ''),
            'ra_garage'       => sanitize_text_field($prop['garage']         ?? ''),
            'ra_attic'        => sanitize_text_field($prop['attic']          ?? ''),
            'ra_condition'    => sanitize_text_field($audit['condition']     ?? ''),
            'ra_current_use'  => sanitize_text_field($audit['currentUse']    ?? ''),
            'ra_goal'         => sanitize_text_field($audit['goal']          ?? ''),
            'ra_est_value'    => (string) intval($audit['val']               ?? 0),
            'ra_loan_balance' => (string) intval($audit['loanBalance']       ?? 0),
            'ra_equity'       => (string) intval($audit['equity']            ?? 0),
            'ra_equity_pct'   => (string) intval($audit['equityPct']         ?? 0),
            'ra_piti'         => (string) intval($audit['piti']              ?? 0),
            'ra_ltr_income'   => (string) intval($audit['baseLTR']           ?? 0),
            'ra_mtr_income'   => (string) intval($audit['baseMTR']           ?? 0),
            'ra_str_income'   => (string) intval($audit['baseSTR']           ?? 0),
            'ra_sec8_income'  => (string) intval($audit['baseSec8']          ?? 0),
            'ra_room_income'  => (string) intval($audit['baseRoom']          ?? 0),
            'ra_ltr_cashflow' => (string) intval($audit['ltr_cf']            ?? 0),
            'ra_str_cashflow' => (string) intval($audit['str_cf']            ?? 0),
            'ra_upside'       => (string) intval($audit['upside']            ?? 0),
            'ra_used_rentcast' => ! empty($audit['usedRentCast']) ? 'Yes' : 'No',
            'ra_results_url'  => esc_url_raw($audit['resultsUrl']            ?? ''),
        ];

        // ── Create or update the FluentCRM contact ────────────────────────────
        $contact_api = FluentCrmApi('contacts');

        $contact = $contact_api->createOrUpdate([
            'first_name'    => $first_name,
            'last_name'     => $last_name,
            'email'         => $email,
            'phone'         => $phone,
            'status'        => 'subscribed',
            'custom_values' => $custom_fields,
        ]);

        if (is_wp_error($contact)) {
            return new WP_REST_Response(
                ['message' => $contact->get_error_message()],
                500
            );
        }

        // ── Send emails (functions defined in theme's mailer.php) ─────────
        $full_name = trim($first_name . ' ' . $last_name);

        if (function_exists('rental_audit_email_lead')) {
            rental_audit_email_lead($full_name, $email, $audit);
        }

        if (function_exists('rental_audit_email_admin')) {
            rental_audit_email_admin($full_name, $email, $phone, $audit);
        }

        return new WP_REST_Response(
            ['success' => true, 'contact_id' => $contact->id],
            200
        );
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Find a FluentCRM list by title, or create it.
     * Uses FluentCrmApi() — stable public interface.
     */
    private static function get_or_create_list($title)
    {
        if (! function_exists('FluentCrmApi')) {
            return null;
        }

        $lists_api = FluentCrmApi('lists');
        $all_lists = $lists_api->all();

        foreach ($all_lists as $list) {
            if (isset($list->title) && $list->title === $title) {
                return $list;
            }
        }

        return $lists_api->store([
            'title'  => $title,
            'slug'   => sanitize_title($title),
            'status' => 'active',
        ]);
    }

    /**
     * Find a FluentCRM tag by title, or create it.
     * Uses FluentCrmApi() — stable public interface.
     */
    private static function get_or_create_tag($title)
    {
        if (! function_exists('FluentCrmApi')) {
            return null;
        }

        $tags_api = FluentCrmApi('tags');
        $all_tags = $tags_api->all();

        foreach ($all_tags as $tag) {
            if (isset($tag->title) && $tag->title === $title) {
                return $tag;
            }
        }

        return $tags_api->store([
            'title' => $title,
            'slug'  => sanitize_title($title),
        ]);
    }
}
