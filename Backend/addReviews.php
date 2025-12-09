<?php
include "./database.php";

$city_id = intval($_POST['city_id']);
$name = $conn->real_escape_string($_POST['name']);
$review = $conn->real_escape_string($_POST['review']);
$rating = intval($_POST['rating']);

$status = "pending";

// INSERT query
$sql = "INSERT INTO reviews (city_id, name, review, rating, status)
        VALUES ($city_id, '$name', '$review', $rating, '$status')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Review added (pending approval)"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}

$conn->close();
?>
