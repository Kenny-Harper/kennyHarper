<?php

	// example use (POST)
	// http://localhost/companydirectory/updateDepartmentByID.php

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

	// Use $_REQUEST for dev like the other files (switch to $_POST for production if needed)
	$id = $_REQUEST['id'] ?? null;
	$name = $_REQUEST['name'] ?? null;
	$locationID = $_REQUEST['locationID'] ?? null;

	if ($id === null || $name === null || $locationID === null) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "bad request";
		$output['status']['description'] = "missing parameters";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;
	}

	// Prevent duplicate department names (optional but good)
	$check = $conn->prepare('SELECT id FROM department WHERE name = ? AND id <> ?');
	$check->bind_param("si", $name, $id);
	$check->execute();
	$checkResult = $check->get_result();

	if ($checkResult->num_rows > 0) {
		$output['status']['code'] = "409";
		$output['status']['name'] = "conflict";
		$output['status']['description'] = "department name already exists";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;
	}

	$query = $conn->prepare('UPDATE department SET name = ?, locationID = ? WHERE id = ?');
	$query->bind_param("sii", $name, $locationID, $id);
	$query->execute();

	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
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
