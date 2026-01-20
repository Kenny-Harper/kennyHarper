<?php

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

	// Optional filters (0 = no filter)
	$departmentID = isset($_REQUEST['departmentID']) ? (int)$_REQUEST['departmentID'] : 0;
	$locationID = isset($_REQUEST['locationID']) ? (int)$_REQUEST['locationID'] : 0;

	// Base query (JOIN like your project expects)
	$queryStr = "
		SELECT 
			p.id,
			p.lastName,
			p.firstName,
			p.jobTitle,
			p.email,
			p.departmentID,
			d.name as department,
			l.name as location
		FROM personnel p
		LEFT JOIN department d ON (d.id = p.departmentID)
		LEFT JOIN location l ON (l.id = d.locationID)
	";

	$where = [];
	$params = [];
	$types = "";

	if ($departmentID > 0) {
		$where[] = "p.departmentID = ?";
		$types .= "i";
		$params[] = $departmentID;
	}

	if ($locationID > 0) {
		$where[] = "d.locationID = ?";
		$types .= "i";
		$params[] = $locationID;
	}

	if (count($where) > 0) {
		$queryStr .= " WHERE " . implode(" AND ", $where);
	}

	$queryStr .= " ORDER BY p.lastName, p.firstName";

	$query = $conn->prepare($queryStr);

	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;

	}

	if (count($params) > 0) {
		$query->bind_param($types, ...$params);
	}

	$query->execute();

	$result = $query->get_result();

	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {
		array_push($data, $row);
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;

	mysqli_close($conn);

	echo json_encode($output);

?>
