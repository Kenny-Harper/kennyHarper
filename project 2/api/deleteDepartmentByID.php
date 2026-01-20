<?php

	// example use from browser
	// http://localhost/companydirectory/deleteDepartmentByID.php?id=<id>

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

	// 1) Integrity check: block delete if personnel exists in this department
	$check = $conn->prepare('SELECT COUNT(id) AS cnt FROM personnel WHERE departmentID = ?');
	$check->bind_param("i", $_REQUEST['id']);
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
	$row = mysqli_fetch_assoc($checkResult);

	if ($row['cnt'] > 0) {

		$output['status']['code'] = "409";
		$output['status']['name'] = "blocked";
		$output['status']['description'] = "cannot delete department with assigned personnel";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;
	}

	// 2) Safe to delete
	$query = $conn->prepare('DELETE FROM department WHERE id = ?');
	$query->bind_param("i", $_REQUEST['id']);
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
