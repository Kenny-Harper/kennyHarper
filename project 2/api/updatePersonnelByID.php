<?php

	// example use from browser
	// http://localhost/companydirectory/updatePersonnelByID.php?id=<id>&firstName=Test&lastName=User&jobTitle=Dev&email=test@x.com&departmentID=1

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

	// Duplicate email check (block if another employee already has this email)
	$dup = $conn->prepare('SELECT COUNT(id) AS cnt FROM personnel WHERE email = ? AND id <> ?');
	$dup->bind_param("si", $_REQUEST['email'], $_REQUEST['id']);
	$dup->execute();

	if (false === $dup) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}

	$dupResult = $dup->get_result();
	$dupRow = mysqli_fetch_assoc($dupResult);

	if ($dupRow['cnt'] > 0) {

		$output['status']['code'] = "409";
		$output['status']['name'] = "blocked";
		$output['status']['description'] = "email already exists";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}

	$query = $conn->prepare('UPDATE personnel SET firstName = ?, lastName = ?, jobTitle = ?, email = ?, departmentID = ? WHERE id = ?');
	$query->bind_param(
		"ssssii",
		$_REQUEST['firstName'],
		$_REQUEST['lastName'],
		$_REQUEST['jobTitle'],
		$_REQUEST['email'],
		$_REQUEST['departmentID'],
		$_REQUEST['id']
	);

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
