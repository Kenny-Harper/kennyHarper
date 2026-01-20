<?php

	// example use (POST)
	// http://localhost/companydirectory/insertLocation.php?name=Berlin

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {

		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;

	}

	$name = $_REQUEST['name'] ?? null;

	if ($name === null || trim($name) === "") {

		$output['status']['code'] = "400";
		$output['status']['name'] = "bad request";
		$output['status']['description'] = "missing parameters";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;

	}

	$name = trim($name);

	// Optional: prevent duplicate location names
	$check = $conn->prepare('SELECT id FROM location WHERE name = ?');
	$check->bind_param("s", $name);
	$check->execute();

	if (false === $check) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;

	}

	$checkResult = $check->get_result();

	if ($checkResult->num_rows > 0) {

		$output['status']['code'] = "409";
		$output['status']['name'] = "conflict";
		$output['status']['description'] = "location already exists";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;

	}

	$query = $conn->prepare('INSERT INTO location (name) VALUES (?)');
	$query->bind_param("s", $name);
	$query->execute();

	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);

?>
