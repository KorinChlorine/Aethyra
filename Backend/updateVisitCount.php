<?php

include "./database.php";

$city_id = intval($_POST['city_id']);

$sql = "UPDATE cities SET visit_count = visit_count + 1 WHERE city_id = $city_id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Visit count incremented"]);
} else {
    echo json_encode(["success" => false, "message" => $conn->error]);
}

header("Content-Type: application/json");
$conn->close();
?>
