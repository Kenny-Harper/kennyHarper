<?php
// getEarthquakes.php
// Returns earthquake data from GeoNames in JSON format

header('Content-Type: application/json');

// Get bounding box coordinates from request
$north = isset($_GET['north']) ? $_GET['north'] : '';
$south = isset($_GET['south']) ? $_GET['south'] : '';
$east  = isset($_GET['east'])  ? $_GET['east']  : '';
$west  = isset($_GET['west'])  ? $_GET['west']  : '';

if ($north === '' || $south === '' || $east === '' || $west === '') {
    echo json_encode(["error" => "Missing bounding box parameters"]);
    exit;
}

// Build the GeoNames API URL
$url = "http://api.geonames.org/earthquakesJSON?north=$north&south=$south&east=$east&west=$west&username=KennyHarper";

// Call the API with cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode(["error" => curl_error($ch)]);
    curl_close($ch);
    exit;
}

curl_close($ch);

// Output GeoNames response directly
echo $response;
?>
