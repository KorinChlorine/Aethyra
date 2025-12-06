<?php
// Include database connection
include "./database.php";

// Check if city_id is provided, if not: exit
if (!isset($_GET['city_id'])) {
    echo json_encode(['error' => 'city_id not provided']);
    exit;
}

$city_id = (int)$_GET['city_id'];

// Fetch foods for this city
$sql = "SELECT food_id, city_id, name, about, location, image
        FROM foods
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
