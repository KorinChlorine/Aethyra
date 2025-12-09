<?php
include "./database.php"; //database connection

// Check if city_id is provided
if (!isset($_GET['city_id'])) {
    echo json_encode(['error' => 'city_id not provided']);
    exit;
}

$city_id = (int)$_GET['city_id'];

// Fetch tourist spots for the city_id provided
$sql = "SELECT activity_id, city_id, name, description, location, image
        FROM activities
        WHERE city_id = $city_id";

$result = $conn->query($sql);

$spots = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $spots[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($spots);
?>
