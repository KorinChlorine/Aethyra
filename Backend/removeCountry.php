<?php
include "./database.php"; //database connection

//if country_id is empty: exit
if (!isset($_POST['country_id'])) {
    echo "No ID received";
    exit;
}

$country_id = intval($_POST['country_id']);

$stmt = $conn->prepare("DELETE FROM countries WHERE country_id = ?");
$stmt->bind_param("i", $country_id);

if ($stmt->execute()) {
    echo "Country deleted successfully";
} else {
    echo "Error deleting: " . $conn->error;
}

?>
