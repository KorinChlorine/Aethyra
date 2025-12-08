<?php
include "./database.php";

//if spot_id is empty: exit
if (!isset($_POST['spot_id'])) {
    echo "No ID received";
    exit;
}

$spot_id = intval($_POST['spot_id']);

$stmt = $conn->prepare("DELETE FROM tourist_spots WHERE spot_id = ?");
$stmt->bind_param("i", $spot_id);

if ($stmt->execute()) {
    echo "Tourist Spot deleted successfully";
} else {
    echo "Error deleting: " . $conn->error;
}

?>
