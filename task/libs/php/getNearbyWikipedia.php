<?php
// getNearbyWikipedia.php
// Returns nearby Wikipedia articles from GeoNames in JSON format

header('Content-Type: application/json');

// Get latitude and longitude from request
$lat = isset($_GET['lat']) ? $_GET['lat'] : '';
$lng = isset($_GET['lng']) ? $_GET['lng'] : '';

if ($lat === '' || $lng === '') {
    echo json_encode(["error" => "Missing lat/lng parameters"]);
    exit;
}

// Build the GeoNames API URL
$url = "http://api.geonames.org/findNearbyWikipediaJSON?lat=$lat&lng=$lng&username=KennyHarper";

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
