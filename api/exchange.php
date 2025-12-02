<?php
// api/exchange.php - Rate limit protected
include('../config.php');

function logMessage($message) {
    $logfile = __DIR__ . '/../logs/api_log.txt';
    $time = date('Y-m-d H:i:s');
    file_put_contents($logfile, "[$time] $message\n", FILE_APPEND);
}

header('Content-Type: application/json');

$currency = strtoupper($_GET['currency'] ?? '');
if (!$currency || strlen($currency) > 3) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid currency code']);
    exit;
}

// STATIC FALLBACK RATES (update manually from time to time)
// These are "1 GBP = X CURRENCY"
$fallbackRates = [
    'GBP' => 1.00,   // base
    'USD' => 1.27,
    'EUR' => 1.19,
    'SEK' => 13.00,  // 🔹 added so 1 GBP != 1 SEK
    'PKR' => 351.50,
    'INR' => 106.50,
    'AUD' => 1.92,
    'CAD' => 1.74,
    'JPY' => 191.20
];

logMessage("Exchange request: $currency");

// 1. Try primary API
$access_key = '602b162a5db3c67ae85cdfd7fbd9da31';
$url = "https://api.exchangeratesapi.io/v1/latest?access_key=$access_key&base=EUR&symbols=GBP,$currency";

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 8,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_USERAGENT => 'Gazetteer/1.0'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200 && $response) {
    $data = json_decode($response, true);
    if ($data && isset($data['rates'])) {
        $rateCurrency = $data['rates'][$currency] ?? null;
        $rateGBP      = $data['rates']['GBP']      ?? null;

        // Convert from EUR-base rates to "1 GBP = X CURRENCY"
        if ($rateCurrency && $rateGBP) {
            $rate = round($rateCurrency / $rateGBP, 4);
            logMessage("SUCCESS API: 1 GBP = $rate $currency");
            echo json_encode([
                'rate'      => $rate,
                'currency'  => $currency,
                'source'    => 'API',
                'timestamp' => $data['date'] ?? date('Y-m-d')
            ]);
            exit;
        }
    }
}

// 2. Rate limit or API error - Use fallback
logMessage("API failed ($httpCode), using fallback for $currency");

$rate = $fallbackRates[$currency] ?? 1.00; // Default 1:1 if unknown

echo json_encode([
    'rate'      => $rate,
    'currency'  => $currency,
    'source'    => 'fallback',
    'timestamp' => date('Y-m-d'),
    'note'      => 'Using cached rate (API rate limited or unavailable)'
]);
exit;
?>
