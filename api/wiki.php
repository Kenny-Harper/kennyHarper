<?php
// api/wiki.php
header('Content-Type: application/json');

// We now expect a COUNTRY NAME here (e.g. "Albania", "United Kingdom")
$countryName = trim($_GET['country'] ?? '');

if ($countryName === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Missing country name']);
    exit;
}

// Build Wikipedia summary API URL using the country name
// Example: https://en.wikipedia.org/api/rest_v1/page/summary/United%20Kingdom
$encodedName = rawurlencode($countryName);
$summaryUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/" . $encodedName;

/**
 * Fetch a URL using cURL if available, otherwise file_get_contents.
 */
function fetchUrl(string $url)
{
    // Prefer cURL (more likely to work in locked-down PHP setups)
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_USERAGENT      => 'GazetteerStudentProject/1.0'
        ]);
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }

    // Fallback to file_get_contents
    return @file_get_contents($url);
}

$data = fetchUrl($summaryUrl);

if ($data === false || $data === null) {
    // Fallback: just send a link to the normal wiki page
    echo json_encode([
        'wiki_url' => "https://en.wikipedia.org/wiki/" . str_replace(' ', '_', $countryName),
        'extract'  => ''
    ]);
    exit;
}

$wiki = json_decode($data, true) ?: [];

// Build a safe URL
$wikiUrl = $wiki['content_urls']['desktop']['page']
    ?? "https://en.wikipedia.org/wiki/" . str_replace(' ', '_', $countryName);

// Try to get the best possible summary text
$extract = $wiki['extract'] ?? '';

// If extract is empty but there is a short description, use that
if ($extract === '' && isset($wiki['description']) && $wiki['description'] !== '') {
    $extract = $wiki['description'];
}

echo json_encode([
    'wiki_url' => $wikiUrl,
    'extract'  => $extract
]);
