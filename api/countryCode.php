<?php

    include('../config.php');

    function logMessage($message) {
        $logfile = __DIR__ . '/../logs/api_log.txt';
        $time = date('Y-m-d H:i:s');
        file_put_contents($logfile, "[$time] $message\n", FILE_APPEND);
    }



    $countryISO3 = strtoupper($_GET['country'] ?? '');
    $username = defined('GEONAMES_USERNAME') ? GEONAMES_USERNAME : null;

	// remove for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url='https://api.opencagedata.com/geocode/v1/json?q='.$_REQUEST['lat'].',+'.$_REQUEST['lng'].'&key=de78f40fbb6540b5b75b6cb4c8969b7e&language=en&pretty=1';


	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode['results'][0]['components']['ISO_3166-1_alpha-3'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>