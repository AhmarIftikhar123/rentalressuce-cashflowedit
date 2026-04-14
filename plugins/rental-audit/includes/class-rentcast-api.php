<?php

/**
 * Class Rentcast_API
 *
 * Handles all server-side communication with the RentCast API.
 * API key is stored in wp-config.php as:
 *   define( 'RENTCAST_API_KEY', 'your_key_here' );
 *
 * Calls two endpoints and merges results:
 *   1. /v1/properties        — beds, baths, sqft, estimated value
 *   2. /v1/avm/rent/long-term — RentCast LTR rent estimate
 */
class Rentcast_API
{

    const BASE_URL = 'https://api.rentcast.io/v1';

    /**
     * Get the API key from wp-config.php constant.
     */
    private static function get_api_key()
    {
        if (! defined('RENTCAST_API_KEY') || empty(RENTCAST_API_KEY)) {
            return new WP_Error('missing_key', 'RentCast API key is not configured. Add define( \'RENTCAST_API_KEY\', \'your_key\' ) to wp-config.php.');
        }
        return RENTCAST_API_KEY;
    }

    /**
     * Shared request helper.
     *
     * @param string $endpoint  e.g. '/properties'
     * @param array  $params    Query string params.
     * @return array|WP_Error   Decoded JSON body or WP_Error.
     */
    private static function get($endpoint, $params = [])
    {
        $key = self::get_api_key();
        if (is_wp_error($key)) {
            return $key;
        }

        $url = add_query_arg($params, self::BASE_URL . $endpoint);

        $response = wp_remote_get($url, [
            'timeout' => 15,
            'headers' => [
                'Accept'    => 'application/json',
                'X-Api-Key' => $key,
            ],
        ]);

        if (is_wp_error($response)) {
            return $response;
        }

        $code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if ($code === 404) {
            return new WP_Error('not_found', 'Property not found. Please check the address and try again.');
        }

        if ($code !== 200) {
            $msg = isset($data['message']) ? $data['message'] : 'RentCast API error (HTTP ' . $code . ').';
            return new WP_Error('api_error', $msg);
        }

        return $data;
    }

    /**
     * Fetch property details from /v1/properties.
     * Returns beds, baths, squareFootage, price (zestimate).
     *
     * @param string $address Full address string.
     * @return array|WP_Error
     */
    public static function get_property($address)
    {
        return self::get('/properties', ['address' => $address]);
    }

    /**
     * Fetch LTR rent estimate from /v1/avm/rent/long-term.
     *
     * @param string $address Full address string.
     * @return array|WP_Error
     */
    public static function get_rent_estimate($address)
    {
        return self::get('/avm/rent/long-term', ['address' => $address]);
    }

    /**
     * Master lookup — calls both endpoints, merges into one clean payload.
     * This is what the REST route calls.
     *
     * Returned shape:
     * {
     *   beds:         string  e.g. "4"
     *   baths:        string  e.g. "3"
     *   sqft:         string  bucket e.g. "2,000–3,000"
     *   estValue:     int     e.g. 420000
     *   rentEstimate: int     RentCast LTR e.g. 2100   ← baseline for all multipliers
     *   garage:       ""      always blank — user fills
     *   attic:        ""      always blank — user fills
     * }
     *
     * @param string $address
     * @return array|WP_Error
     */
    public static function lookup($address)
    {

        $property = self::get_property($address);
        if (is_wp_error($property)) {
            return $property;
        }

        $prop     = isset($property[0]) ? $property[0] : [];
        $features = isset($prop['features']) ? $prop['features'] : [];

        // Rent estimate
        $rent       = self::get_rent_estimate($address);
        $rent_value = 0;
        if (! is_wp_error($rent) && isset($rent['rent'])) {
            $rent_value = (int) round($rent['rent']);
        }

        // Property value estimate — dedicated AVM endpoint
        $value_est  = self::get_value_estimate($address);
        $est_value  = 0;
        if (! is_wp_error($value_est) && isset($value_est['price'])) {
            $est_value = (int) round($value_est['price']);
        }
        // Fallback to lastSalePrice if AVM value unavailable
        if ($est_value === 0 && isset($prop['lastSalePrice'])) {
            $est_value = (int) $prop['lastSalePrice'];
        }

        $sqft_raw = isset($prop['squareFootage']) ? (int) $prop['squareFootage'] : 0;

        // Garage
        $garage = '';
        if (! empty($features['garage'])) {
            $type = isset($features['garageType']) ? strtolower($features['garageType']) : '';
            if (strpos($type, 'attached') !== false) {
                $garage = 'Attached';
            } elseif (strpos($type, 'detached') !== false) {
                $garage = 'Detached';
            } else {
                $garage = 'Yes';
            }
        } elseif (isset($features['garage']) && $features['garage'] === false) {
            $garage = 'No';
        }

        return [
            'beds'         => isset($prop['bedrooms'])  ? (string) $prop['bedrooms']  : '',
            'baths'        => isset($prop['bathrooms']) ? (string) $prop['bathrooms'] : '',
            'sqft'         => self::sqft_bucket($sqft_raw),
            'estValue'     => $est_value,
            'rentEstimate' => $rent_value,
            'garage'       => $garage,
            'attic'        => '',
        ];
    }

    /**
     * Convert raw sqft integer to the bucket string the frontend uses.
     */
    private static function sqft_bucket($sqft)
    {
        if ($sqft <= 0)    return '';
        if ($sqft < 1000)  return 'Under 1,000';
        if ($sqft < 1500)  return '1,000–1,500';
        if ($sqft < 2000)  return '1,500–2,000';
        if ($sqft < 3000)  return '2,000–3,000';
        return '3,000+';
    }
    /**
     * Fetch property value estimate from /v1/avm/value.
     *
     * @param string $address
     * @return array|WP_Error
     */
    public static function get_value_estimate($address)
    {
        return self::get('/avm/value', ['address' => $address]);
    }
}
