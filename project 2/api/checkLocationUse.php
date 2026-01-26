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
Location dependency check (parallel to CodePen pattern):
- Count departments assigned to this location

SELECT
   l.id as locationID,
   l.name as locationName,
   COUNT(d.id) as departmentCount
FROM location l
LEFT JOIN department d ON (d.locationID = l.id)
WHERE l.id = ?
GROUP BY l.id, l.name
*/

$query = $conn->prepare('
	SELECT
		l.id AS locationID,
		l.name AS locationName,
		COUNT(d.id) AS departmentCount
	FROM location l
	LEFT JOIN department d ON (d.locationID = l.id)
	WHERE l.id = ?
	GROUP BY l.id, l.name
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
	$row['departmentCount'] = (string)(int)$row['departmentCount'];
	$data[] = $row;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

mysqli_close($conn);
echo json_encode($output);
