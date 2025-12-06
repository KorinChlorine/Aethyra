<?php
include "./database.php"; // DB connection

$reviews = [];

// Check if city_id exist, if yes: fetch specific review
if (isset($_GET['city_id']) && $_GET['city_id'] !== "") {
    $city_id = intval($_GET['city_id']);

    // Fetch specific city reviews
    $sql = "SELECT review_id, city_id, name, review, rating, status 
            FROM reviews 
            WHERE city_id = ? AND status = 'approved'
            ORDER BY review_id DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $city_id);
    $stmt->execute();
    $result = $stmt->get_result();

//if not, fetch all
} else {

    // Fetch ALL reviews
    $sql = "SELECT review_id, city_id, name, review, rating, status 
            FROM reviews 
            ORDER BY review_id DESC";

    $result = $conn->query($sql);
}

while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}

header("Content-Type: application/json");
echo json_encode($reviews);
?>
