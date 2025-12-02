<?php

function logMessage($message) {
    $logfile = __DIR__ . '/../logs/api_log.txt';
    $time = date('Y-m-d H:i:s');
    file_put_contents($logfile, "[$time] $message\n", FILE_APPEND);
}

$code = $_GET['code'] ?? null;
$fields = $_GET['fields'] ?? null;

if (!$code) {
    http_response_code(400);
    $error = 'Missing country code';
    logMessage("ERROR: $error");
    echo json_encode(['error' => $error]);
    exit;
}

$baseUrl = "https://restcountries.com/v3.1/alpha/" . urlencode($code);
$url = $baseUrl;
if ($fields) {
    // Validate and urlencode fields parameter; fields separated by commas
    $fieldsParam = urlencode($fields);
    $url .= "?fields=$fieldsParam";
}

logMessage("Requesting country from Rest Countries API: $url");

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    $error_msg = curl_error($ch);
    curl_close($ch);
    logMessage("cURL Error: $error_msg");
    http_response_code(500);
    echo json_encode(['error' => $error_msg]);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode == 404) {
    logMessage("Country API returned 404 for code $code");
    http_response_code(404);
    echo json_encode(['status' => 404, 'error' => 'Country not found for code ' . htmlspecialchars($code)]);
    exit;
}

if ($httpCode != 200 || !$response) {
    logMessage("Country API unexpected HTTP code: $httpCode");
    http_response_code($httpCode);
    echo json_encode(['error' => "Country API HTTP status $httpCode"]);
    exit;
}

header('Content-Type: application/json');
echo $response;

?>
