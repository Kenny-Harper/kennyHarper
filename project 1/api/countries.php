<?php
// api/countries.php

function logMessage($message) {
    $logfile = __DIR__ . '/../logs/api_log.txt';
    $time = date('Y-m-d H:i:s');
    file_put_contents($logfile, "[$time] $message\n", FILE_APPEND);
}

header('Content-Type: application/json');

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

// Build a lightweight list of { code, name } using ISO3 code from 'id' field
$countries = [];
foreach ($data['features'] as $feature) {
    $props = $feature['properties'] ?? [];
    $name = $props['name'] ?? $props['ADMIN'] ?? $props['Name'] ?? null;

    $iso3 = strtoupper($feature['id'] ?? '');

    if ($name && $iso3 && strlen($iso3) === 3 && $iso3 !== '-99') {
        $countries[] = [
            'code' => $iso3,
            'name' => $name
        ];
    }
}

logMessage("countries.php returned " . count($countries) . " countries");

echo json_encode($countries);
exit;
