<?php

include "./database.php";

$sql = "SELECT city_id, name, description, visit_count
        FROM cities
        ORDER BY visit_count DESC
        LIMIT 5";

$result = $conn->query($sql);
$cities = [];

while ($row = $result->fetch_assoc()) {
    $cities[] = $row;
}

header("Content-Type: application/json");
echo json_encode($cities);

$conn->close();
?>
