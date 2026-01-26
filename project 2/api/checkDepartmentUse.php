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
	echo json_encode($output);
	exit;
}

$id = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;

if ($id <= 0) {
	$output['status']['code'] = "400";
	$output['status']['name'] = "bad request";
	$output['status']['description'] = "missing id";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	mysqli_close($conn);
	echo json_encode($output);
	exit;
}

/*
SQL matches CodePen:

SELECT
   d.id as departmentID,
   d.name AS departmentName,
   COUNT(p.id) as personnelCount
FROM department d
LEFT JOIN personnel p ON (p.departmentID = d.id)
WHERE d.id  = ?
*/

$query = $conn->prepare('
	SELECT
		d.id AS departmentID,
		d.name AS departmentName,
		COUNT(p.id) AS personnelCount
	FROM department d
	LEFT JOIN personnel p ON (p.departmentID = d.id)
	WHERE d.id = ?
	GROUP BY d.id, d.name
');

$query->bind_param("i", $id);
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

$result = $query->get_result();
$data = [];

while ($row = mysqli_fetch_assoc($result)) {
	// make sure personnelCount is numeric-like
	$row['personnelCount'] = (string)(int)$row['personnelCount'];
	$data[] = $row;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

mysqli_close($conn);
echo json_encode($output);
