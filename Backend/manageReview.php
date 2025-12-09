<?php
include "./database.php";

if (!isset($_POST['review_id']) || !isset($_POST['action'])) {
    echo json_encode(["success" => false, "message" => "Missing parameters"]);
    exit;
}

$review_id = intval($_POST['review_id']);
$action = $_POST['action'];

if ($action === "approve") {
    // Update status → approved
    $sql = "UPDATE reviews SET status='approved' WHERE review_id = $review_id";

} elseif ($action === "reject") {
    // Reject → delete review
    $sql = "DELETE FROM reviews WHERE review_id = $review_id";

} else {
    echo json_encode(["success" => false, "message" => "Invalid action"]);
    exit;
}

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Action successful"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}

$conn->close();
?>
