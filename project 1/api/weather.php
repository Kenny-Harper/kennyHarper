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

$url = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lng&units=metric&appid=" . OPENWEATHER_API_KEY;
logMessage("Request URL: $url");

$response = @file_get_contents($url);
if ($response === false) {
    logMessage("ERROR: Failed to fetch API response.");
    http_response_code(500);
    echo json_encode(['error' => 'Unable to fetch data from OpenWeather API']);
    exit;
}

logMessage("API Response received: " . substr($response, 0, 200) . "...");

header('Content-Type: application/json');
echo $response;
?>
