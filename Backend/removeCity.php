<?php
include "./database.php"; // database connection

// Check if city_id is provided
if (!isset($_POST['city_id'])) {
    echo "No ID received";
    exit;
}

$city_id = intval($_POST['city_id']);


$stmt = $conn->prepare("DELETE FROM cities WHERE city_id = ?");
$stmt->bind_param("i", $city_id);


if ($stmt->execute()) {
    echo "City deleted successfully";
} else {
    echo "Error deleting city: " . $conn->error;
}

?>
