<?php
// api/border.php

function logMessage($message) {
    $logfile = __DIR__ . '/../logs/api_log.txt';
    $time = date('Y-m-d H:i:s');
    file_put_contents($logfile, "[$time] $message\n", FILE_APPEND);
}

header('Content-Type: application/json');

$code = $_GET['code'] ?? null;

if (!$code) {
    http_response_code(400);
    $error = 'Missing country code';
    logMessage("ERROR: $error");
    echo json_encode(['error' => $error]);
    exit;
}

$code = strtoupper($code);

$geoJsonPath = __DIR__ . '/../data/countryBorders.geo.json';

if (!file_exists($geoJsonPath)) {
    http_response_code(500);
    $error = 'countryBorders.geo.json not found';
    logMessage("ERROR: $error");
    echo json_encode(['error' => $error]);
    exit;
}

$json = file_get_contents($geoJsonPath);
if ($json === false) {
    http_response_code(500);
    $error = 'Unable to read countryBorders.geo.json';
    logMessage("ERROR: $error");
    echo json_encode(['error' => $error]);
    exit;
}

$data = json_decode($json, true);
if (!isset($data['features']) || !is_array($data['features'])) {
    http_response_code(500);
    $error = 'Invalid GeoJSON structure';
    logMessage("ERROR: $error");
    echo json_encode(['error' => $error]);
    exit;
}

$feature = null;
foreach ($data['features'] as $f) {
    $id = strtoupper($f['id'] ?? '');
    $iso_a2 = strtoupper($f['properties']['ISO_A2'] ?? '');
    if ($id === $code || $iso_a2 === $code) {
        $feature = $f;
        break;
    }
}

if (!$feature) {
    http_response_code(404);
    $error = "No border found for code $code";
    logMessage("ERROR: $error");
    echo json_encode(['error' => $error]);
    exit;
}

logMessage("border.php returned feature for $code");
echo json_encode($feature);
exit;
?>
