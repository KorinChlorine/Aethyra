<?php
include "./database.php";

//if food_id is empty: exit
if (!isset($_POST['food_id'])) {
    echo "No ID received";
    exit;
}

$food_id = intval($_POST['food_id']);

$stmt = $conn->prepare("DELETE FROM foods WHERE food_id = ?");
$stmt->bind_param("i", $food_id);

if ($stmt->execute()) {
    echo "Tourist Spot deleted successfully";
} else {
    echo "Error deleting: " . $conn->error;
}

?>
