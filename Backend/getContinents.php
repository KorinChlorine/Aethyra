<?php
include "./database.php"; // database connection

header('Content-Type: application/json');

// Check if continent_id is provided
if (!isset($_GET['continent_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'continent_id not provided']);
    exit;
}

$continent_id = (int) $_GET['continent_id'];

// Prepare safe query
$sql = "SELECT * FROM continents WHERE continent_id = ? LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $continent_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $continent = $result->fetch_assoc();
    echo json_encode([
        "status" => "success",
        "data" => $continent
    ]);
} else {
    echo json_encode([
        "status" => "empty",
        "message" => "Continent not found"
    ]);
}
?>
