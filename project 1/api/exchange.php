<?php
// api/exchange.php - returns a list of rates for dropdown, with selectable base (default USD)
require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

function logMessage($message) {
  $logfile = __DIR__ . '/../logs/api_log.txt';
  $time = date('Y-m-d H:i:s');
  file_put_contents($logfile, "[$time] $message\n", FILE_APPEND);
}

// base currency for "From" (default USD)
$base = strtoupper($_GET['base'] ?? 'USD');
if (!$base || strlen($base) > 3) $base = 'USD';

// selected target currency for pre-selecting dropdown
$selected = strtoupper($_GET['currency'] ?? 'ARS');
if (!$selected || strlen($selected) > 3) $selected = 'ARS';

// currency list shown in dropdown
$currencyNames = [
  "ARS"=>"Argentine Peso",
  "AUD"=>"Australian Dollar",
  "BHD"=>"Bahraini Dinar",
  "BWP"=>"Botswana Pula",
  "BRL"=>"Brazilian Real",
  "BND"=>"Bruneian Dollar",
  "BGN"=>"Bulgarian Lev",
  "CAD"=>"Canadian Dollar",
  "CLP"=>"Chilean Peso",
  "CNY"=>"Chinese Yuan Renminbi",
  "COP"=>"Colombian Peso",
  "CZK"=>"Czech Koruna",
  "DKK"=>"Danish Krone",
  "AED"=>"Emirati Dirham",
  "EUR"=>"Euro",
  "GBP"=>"Great British Pound",
  "HKD"=>"Hong Kong Dollar",
  "HUF"=>"Hungarian Forint",
  "ISK"=>"Icelandic Krona",
  "INR"=>"Indian Rupee",
  "IDR"=>"Indonesian Rupiah",
  "IRR"=>"Iranian Rial",
  "ILS"=>"Israeli Shekel",
  "JPY"=>"Japanese Yen",
  "KZT"=>"Kazakhstani Tenge",
  "KWD"=>"Kuwaiti Dinar",
  "LYD"=>"Libyan Dinar",
  "MYR"=>"Malaysian Ringgit",
  "MUR"=>"Mauritian Rupee",
  "MXN"=>"Mexican Peso",
  "NPR"=>"Nepalese Rupee",
  "NZD"=>"New Zealand Dollar",
  "NOK"=>"Norwegian Krone",
  "OMR"=>"Omani Rial",
  "PKR"=>"Pakistani Rupee",
  "PHP"=>"Philippine Peso",
  "PLN"=>"Polish Zloty",
  "QAR"=>"Qatari Riyal",
  "RON"=>"Romanian New Leu",
  "RUB"=>"Russian Ruble",
  "SAR"=>"Saudi Arabian Riyal",
  "SGD"=>"Singapore Dollar",
  "ZAR"=>"South African Rand",
  "KRW"=>"South Korean Won",
  "LKR"=>"Sri Lankan Rupee",
  "SEK"=>"Swedish Krona",
  "CHF"=>"Swiss Franc",
  "TWD"=>"Taiwan New Dollar",
  "THB"=>"Thai Baht",
  "TTD"=>"Trinidadian Dollar",
  "TRY"=>"Turkish Lira",
  "USD"=>"US Dollar"
];

// ensure base exists in list (so conversion always works)
if (!isset($currencyNames[$base])) {
  $currencyNames[$base] = $base;
}

$access_key = OPENEXCHANGE_API_KEY;

// Request EUR-base rates including BASE + all dropdown currencies
$symbols = array_keys($currencyNames);
$symbols = array_unique($symbols);

$url = "https://api.exchangeratesapi.io/v1/latest?access_key=$access_key&base=EUR&symbols=" . implode(",", $symbols);
logMessage("Exchange list request: $url");

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

$source = 'API';
$timestamp = date('Y-m-d');
$ratesOut = [];

// build dropdown rates: 1 BASE = X CODE
function buildRatesList($currencyNames, $eurRates, $base) {
  $out = [];
  $baseRate = $eurRates[$base] ?? null; // EUR -> BASE

  // if base is EUR, baseRate = 1
  if ($base === 'EUR') $baseRate = 1;

  if (!$baseRate) return [];

  foreach ($currencyNames as $code => $name) {
    $codeRate = ($code === 'EUR') ? 1 : ($eurRates[$code] ?? null);
    if ($codeRate === null) continue;

    $cross = $codeRate / $baseRate; // 1 BASE = cross CODE
    $out[] = [
      'code' => $code,
      'name' => $name,
      'rate' => round($cross, 6)
    ];
  }

  return $out;
}

if ($httpCode === 200 && $response) {
  $data = json_decode($response, true);

  if (is_array($data) && isset($data['rates'])) {
    $timestamp = $data['date'] ?? $timestamp;
    $ratesOut = buildRatesList($currencyNames, $data['rates'], $base);
  } else {
    $source = 'fallback';
  }
} else {
  $source = 'fallback';
}

if (!$ratesOut) {
  // minimal fallback (keeps dropdown usable if API fails)
  $source = 'fallback';
  $ratesOut = [
    ['code'=>'USD','name'=>'US Dollar','rate'=>1.00],
    ['code'=>'EUR','name'=>'Euro','rate'=>0.90],
    ['code'=>'GBP','name'=>'British Pound','rate'=>0.78],
    ['code'=>'ARS','name'=>'Argentine Peso','rate'=>850.00],
  ];
}

$validCodes = array_column($ratesOut, 'code');
if (!in_array($selected, $validCodes, true)) $selected = 'USD';

echo json_encode([
  'base'      => $base,
  'selected'  => $selected,
  'rates'     => $ratesOut,
  'source'    => $source,
  'timestamp' => $timestamp
], JSON_PRETTY_PRINT);

exit;
?>
