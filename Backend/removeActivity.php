<?php
include "./database.php"; //database connection

//if activity_id is empty: exit
if (!isset($_POST['activity_id'])) {
    echo "No ID received";
    exit;
}

$activity_id = intval($_POST['activity_id']);

$stmt = $conn->prepare("DELETE FROM activities WHERE activity_id = ?");
$stmt->bind_param("i", $activity_id);

if ($stmt->execute()) {
    echo "Acitivity deleted successfully";
} else {
    echo "Error deleting: " . $conn->error;
}

?>
