<?php
// api/news.php - NewsData.io 
header('Content-Type: application/json');

$countryISO2 = strtoupper($_GET['country'] ?? 'US');
$apiKey = 'pub_d7716970232c4982a3d6f9dfc0a9994d';

$supportedCountries = [
    "US", "GB", "FR", "DE", "IT", "ES", "PK", "IN", "CA", "AU", "JP", "BR", "RU",
    "CN", "KR", "NL", "SE", "NO", "DK", "FI", "PL", "CZ", "HU", "RO", "GR", "TR",
    "NG", "ZA", "EG", "AE", "SA", "MX", "AR", "CL", "CO", "PE", "ID", "MY", "PH",
    "TH", "SG", "VN", "TW", "HK", "NZ", "IE", "AT", "CH", "BE", "PT", "UA", "IL"
];

if (!in_array($countryISO2, $supportedCountries)) {
    http_response_code(400);
    echo json_encode(['error' => "Unsupported country: $countryISO2"]);
    exit;
}

// Build NewsData.io Latest endpoint
$url = "https://newsdata.io/api/1/latest?country=$countryISO2&apikey=$apiKey";

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_USERAGENT => 'Gazetteer/1.0 (NewsData)'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200 || !$response) {
    http_response_code($httpCode);
    echo json_encode(['error' => "NewsData returned HTTP $httpCode"]);
    exit;
}

$data = json_decode($response, true);

//  COMPLETE NewsData.io response (all fields)
echo json_encode([
    'raw_response' => $data,
    'country' => $countryISO2,
    'status' => $data['status'] ?? 'unknown',
    'totalResults' => $data['totalResults'] ?? 0,
    'articles_count' => count($data['results'] ?? []),
    'articles' => array_map(function($article) {
        return [
            'title' => $article['title'] ?? 'No title',
            'source' => $article['source_id'] ?? $article['creator'] ?? 'Unknown',
            'url' => $article['link'] ?? '#',
            'published' => $article['pubDate'] ?? '',
            'description' => substr($article['description'] ?? $article['content'] ?? '', 0, 100) . '...',
            'image_url' => $article['image'] ?? null,
            'country' => $article['country'] ?? [],
            'category' => $article['category'] ?? []
        ];
    }, $data['results'] ?? [])
], JSON_PRETTY_PRINT);
exit;
?>
