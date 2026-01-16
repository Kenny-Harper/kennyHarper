<?php
// api/geonames.php
require_once __DIR__ . '/config.php';

function logMessage($message) {
    $logfile = __DIR__ . '/../logs/api_log.txt';
    $time = date('Y-m-d H:i:s');
    file_put_contents($logfile, "[$time] $message\n", FILE_APPEND);
}

header('Content-Type: application/json');

$countryISO3 = strtoupper($_GET['country'] ?? '');
$username = defined('GEONAMES_USERNAME') ? GEONAMES_USERNAME : null;

if (!$countryISO3) {
    http_response_code(400);
    $error = 'Missing country code';
    logMessage("ERROR: $error");
    echo json_encode(['error' => $error]);
    exit;
}

if (!$username) {
    http_response_code(500);
    $error = 'GeoNames username not configured';
    logMessage("ERROR: $error");
    echo json_encode(['error' => $error]);
    exit;
}

$iso3to2 = [
    "AFG"=>"AF","ALA"=>"AX","ALB"=>"AL","DZA"=>"DZ","ASM"=>"AS","AND"=>"AD","AGO"=>"AO","AIA"=>"AI","ATA"=>"AQ","ATG"=>"AG","ARG"=>"AR","ARM"=>"AM","ABW"=>"AW","AUS"=>"AU","AUT"=>"AT","AZE"=>"AZ",
    "BHS"=>"BS","BHR"=>"BH","BGD"=>"BD","BRB"=>"BB","BLR"=>"BY","BEL"=>"BE","BLZ"=>"BZ","BEN"=>"BJ","BMU"=>"BM","BTN"=>"BT","BOL"=>"BO","BES"=>"BQ","BIH"=>"BA","BWA"=>"BW","BVT"=>"BV","BRA"=>"BR",
    "IOT"=>"IO","BRN"=>"BN","BGR"=>"BG","BFA"=>"BF","BDI"=>"BI","CPV"=>"CV","KHM"=>"KH","CMR"=>"CM","CAN"=>"CA","CYM"=>"KY","CAF"=>"CF","TCD"=>"TD","CHL"=>"CL","CHN"=>"CN","CXR"=>"CX","CCK"=>"CC",
    "COL"=>"CO","COM"=>"KM","COG"=>"CG","COD"=>"CD","COK"=>"CK","CRI"=>"CR","CIV"=>"CI","HRV"=>"HR","CUB"=>"CU","CUW"=>"CW","CYP"=>"CY","CZE"=>"CZ","DNK"=>"DK","DJI"=>"DJ","DMA"=>"DM","DOM"=>"DO",
    "ECU"=>"EC","EGY"=>"EG","SLV"=>"SV","GNQ"=>"GQ","ERI"=>"ER","EST"=>"EE","ETH"=>"ET","FLK"=>"FK","FRO"=>"FO","FJI"=>"FJ","FIN"=>"FI","FRA"=>"FR","GUF"=>"GF","PYF"=>"PF","ATF"=>"TF","GAB"=>"GA",
    "GMB"=>"GM","GEO"=>"GE","DEU"=>"DE","GHA"=>"GH","GIB"=>"GI","GRC"=>"GR","GRL"=>"GL","GRD"=>"GD","GLP"=>"GP","GUM"=>"GU","GTM"=>"GT","GGY"=>"GG","GIN"=>"GN","GNB"=>"GW","GUY"=>"GY","HTI"=>"HT",
    "HMD"=>"HM","VAT"=>"VA","HND"=>"HN","HKG"=>"HK","HUN"=>"HU","ISL"=>"IS","IND"=>"IN","IDN"=>"ID","IRN"=>"IR","IRQ"=>"IQ","IRL"=>"IE","IMN"=>"IM","ISR"=>"IL","ITA"=>"IT","JAM"=>"JM","JPN"=>"JP",
    "JEY"=>"JE","JOR"=>"JO","KAZ"=>"KZ","KEN"=>"KE","KIR"=>"KI","PRK"=>"KP","KOR"=>"KR","KWT"=>"KW","KGZ"=>"KG","LAO"=>"LA","LVA"=>"LV","LBN"=>"LB","LSO"=>"LS","LBR"=>"LR","LBY"=>"LY","LIE"=>"LI",
    "LTU"=>"LT","LUX"=>"LU","MAC"=>"MO","MKD"=>"MK","MDG"=>"MG","MWI"=>"MW","MYS"=>"MY","MDV"=>"MV","MLI"=>"ML","MLT"=>"MT","MHL"=>"MH","MTQ"=>"MQ","MRT"=>"MR","MUS"=>"MU","MYT"=>"YT","MEX"=>"MX",
    "FSM"=>"FM","MDA"=>"MD","MCO"=>"MC","MNG"=>"MN","MNE"=>"ME","MSR"=>"MS","MAR"=>"MA","MOZ"=>"MZ","MMR"=>"MM","NAM"=>"NA","NRU"=>"NR","NPL"=>"NP","NLD"=>"NL","NCL"=>"NC","NZL"=>"NZ","NIC"=>"NI",
    "NER"=>"NE","NGA"=>"NG","NIU"=>"NU","NFK"=>"NF","MNP"=>"MP","NOR"=>"NO","OMN"=>"OM","PAK"=>"PK","PLW"=>"PW","PSE"=>"PS","PAN"=>"PA","PNG"=>"PG","PRY"=>"PY","PER"=>"PE","PHL"=>"PH","PCN"=>"PN",
    "POL"=>"PL","PRT"=>"PT","PRI"=>"PR","QAT"=>"QA","REU"=>"RE","ROU"=>"RO","RUS"=>"RU","RWA"=>"RW","BLM"=>"BL","SHN"=>"SH","KNA"=>"KN","LCA"=>"LC","MAF"=>"MF","SPM"=>"PM","VCT"=>"VC","WSM"=>"WS",
    "SMR"=>"SM","STP"=>"ST","SAU"=>"SA","SEN"=>"SN","SRB"=>"RS","SYC"=>"SC","SLE"=>"SL","SGP"=>"SG","SXM"=>"SX","SVK"=>"SK","SVN"=>"SI","SLB"=>"SB","SOM"=>"SO","ZAF"=>"ZA","SGS"=>"GS","SSD"=>"SS",
    "ESP"=>"ES","LKA"=>"LK","SDN"=>"SD","SUR"=>"SR","SJM"=>"SJ","SWZ"=>"SZ","SWE"=>"SE","CHE"=>"CH","SYR"=>"SY","TWN"=>"TW","TJK"=>"TJ","TZA"=>"TZ","THA"=>"TH","TLS"=>"TL","TGO"=>"TG","TKL"=>"TK",
    "TON"=>"TO","TTO"=>"TT","TUN"=>"TN","TUR"=>"TR","TKM"=>"TM","TCA"=>"TC","TUV"=>"TV","UGA"=>"UG","UKR"=>"UA","ARE"=>"AE","GBR"=>"GB","USA"=>"US","UMI"=>"UM","URY"=>"UY","UZB"=>"UZ","VUT"=>"VU",
    "VEN"=>"VE","VNM"=>"VN","VGB"=>"VG","VIR"=>"VI","WLF"=>"WF","ESH"=>"EH","YEM"=>"YE","ZMB"=>"ZM","ZWE"=>"ZW"
];

if (!isset($iso3to2[$countryISO3])) {
    http_response_code(400);
    $error = "Unsupported ISO3 country code: $countryISO3";
    logMessage("ERROR: $error");
    echo json_encode(['error' => $error]);
    exit;
}
$countryISO2 = $iso3to2[$countryISO3];

function curlGetJson($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_FAILONERROR, false);
    $response = curl_exec($ch);

    if ($response === false) {
        $error = curl_error($ch);
        curl_close($ch);
        return ['error' => $error];
    }

    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $data = json_decode($response, true);
    if (!is_array($data)) {
        return ['error' => "Invalid JSON (HTTP $http)"];
    }

    // GeoNames sometimes returns {"status":{...}} on errors
    if (isset($data['status']['message'])) {
        return ['error' => $data['status']['message']];
    }

    return $data;
}

$citiesUrl = "https://secure.geonames.org/searchJSON?country=$countryISO2&featureClass=P&maxRows=50&username=$username";
logMessage("GeoNames cities URL: $citiesUrl");
$citiesData = curlGetJson($citiesUrl);
if (isset($citiesData['error'])) {
    logMessage("GeoNames Cities API error: " . $citiesData['error']);
    $citiesData['geonames'] = [];
}

$airportsUrl = "https://secure.geonames.org/searchJSON?country=$countryISO2&featureClass=S&featureCode=AIRP&maxRows=50&username=$username";
logMessage("GeoNames airports URL: $airportsUrl");
$airportsData = curlGetJson($airportsUrl);
if (isset($airportsData['error'])) {
    logMessage("GeoNames Airports API error: " . $airportsData['error']);
    $airportsData['geonames'] = [];
}

$cities = [];
foreach ($citiesData['geonames'] ?? [] as $c) {
    $cities[] = [
        'name' => $c['name'] ?? 'Unknown',
        'lat'  => floatval($c['lat'] ?? 0),
        'lng'  => floatval($c['lng'] ?? 0),
    ];
}

$airports = [];
foreach ($airportsData['geonames'] ?? [] as $a) {
    $airports[] = [
        'name' => $a['name'] ?? 'Unknown',
        'lat'  => floatval($a['lat'] ?? 0),
        'lng'  => floatval($a['lng'] ?? 0),
    ];
}

echo json_encode([
    'cities'   => $cities,
    'airports' => $airports,
]);
exit;
