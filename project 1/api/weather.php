<?php
require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

function logMessage($message) {
  $logfile = __DIR__ . '/../logs/api_log.txt';
  $time = date('Y-m-d H:i:s');
  file_put_contents($logfile, "[$time] $message\n", FILE_APPEND);
}

$lat = $_GET['lat'] ?? null;
$lng = $_GET['lng'] ?? null;
$label = trim($_GET['label'] ?? '');

if ($lat === null || $lng === null) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing lat or lng']);
  exit;
}

// OpenWeather 5-day / 3-hour forecast (free)
$url = "https://api.openweathermap.org/data/2.5/forecast?lat=$lat&lon=$lng&units=metric&appid=" . OPENWEATHER_API_KEY;
logMessage("Forecast URL: $url");

$response = @file_get_contents($url);
if ($response === false) {
  http_response_code(500);
  echo json_encode(['error' => 'Unable to fetch data from OpenWeather API']);
  exit;
}

$data = json_decode($response, true);
if (!is_array($data) || !isset($data['list']) || !isset($data['city'])) {
  http_response_code(500);
  echo json_encode(['error' => 'Invalid forecast response']);
  exit;
}

$cityName = $label !== '' ? $label : ($data['city']['name'] ?? 'Unknown');
$country  = $data['city']['country'] ?? '';
$tzOffset = $data['city']['timezone'] ?? 0; // seconds

// Group entries by local date
$days = [];
foreach ($data['list'] as $item) {
  $dt = $item['dt'] ?? null;
  if (!$dt) continue;

  $localTs = $dt + $tzOffset;
  $dateKey = gmdate('Y-m-d', $localTs);

  $tempMin = $item['main']['temp_min'] ?? null;
  $tempMax = $item['main']['temp_max'] ?? null;

  $desc = $item['weather'][0]['description'] ?? '';
  $icon = $item['weather'][0]['icon'] ?? '';

  $days[$dateKey][] = [
    'localTs' => $localTs,
    'tempMin' => $tempMin,
    'tempMax' => $tempMax,
    'desc' => $desc,
    'icon' => $icon
  ];
}

$todayKey = gmdate('Y-m-d', time() + $tzOffset);

function pickMiddayCondition($entries) {
  $targetHour = 12;
  $best = $entries[0];
  $bestDiff = PHP_INT_MAX;

  foreach ($entries as $e) {
    $h = (int) gmdate('H', $e['localTs']);
    $diff = abs($h - $targetHour);
    if ($diff < $bestDiff) {
      $bestDiff = $diff;
      $best = $e;
    }
  }
  return $best;
}

$keys = array_keys($days);
sort($keys);

$forecastOut = [];
foreach ($keys as $k) {
  if ($k < $todayKey) continue;
  if (count($forecastOut) >= 3) break;

  $entries = $days[$k];

  $minC = null;
  $maxC = null;
  foreach ($entries as $e) {
    if ($e['tempMin'] !== null) $minC = ($minC === null) ? $e['tempMin'] : min($minC, $e['tempMin']);
    if ($e['tempMax'] !== null) $maxC = ($maxC === null) ? $e['tempMax'] : max($maxC, $e['tempMax']);
  }

  $mid = pickMiddayCondition($entries);

  $forecastOut[] = [
    'date' => $k,
    'conditionText' => $mid['desc'],
    'conditionIcon' => $mid['icon'] ? "https://openweathermap.org/img/wn/" . $mid['icon'] . "@2x.png" : "",
    'minC' => ($minC === null) ? null : (int) round($minC),
    'maxC' => ($maxC === null) ? null : (int) round($maxC),
  ];
}

echo json_encode([
  'location' => $cityName,
  'country' => $country,
  'lastUpdated' => gmdate('c', time() + $tzOffset),
  'forecast' => $forecastOut
], JSON_PRETTY_PRINT);

exit;
?>
