<?php
include('../config.php');

function logMessage($message) {
    $logfile = __DIR__ . '/../logs/api_log.txt';
    $time = date('Y-m-d H:i:s');
    file_put_contents($logfile, "[$time] $message\n", FILE_APPEND);
}

$lat = $_GET['lat'] ?? null;
$lng = $_GET['lng'] ?? null;

if (!$lat || !$lng) {
    http_response_code(400);
    $error = 'Missing lat or lng';
    logMessage("ERROR: $error");
    echo json_encode(['error' => $error]);
    exit;
}

$url = "https://api.opencagedata.com/geocode/v1/json?q=$lat+$lng&key=" . OPENCAGE_API_KEY;
logMessage("Request URL: $url");

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$response = curl_exec($ch);

// Handle cURL errors
if (curl_errno($ch)) {
    $errorMsg = curl_error($ch);
    logMessage("ERROR: cURL failed: $errorMsg");
    http_response_code(500);
    echo json_encode(['error' => "cURL error: $errorMsg"]);
    curl_close($ch);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200 || !$response) {
    logMessage("ERROR: HTTP Status $httpCode or empty response.");
    http_response_code($httpCode);
    echo json_encode(['error' => "HTTP Status $httpCode"]);
    exit;
}

logMessage("API Response received: " . substr($response, 0, 200) . "...");

header('Content-Type: application/json');
echo $response;
?>
