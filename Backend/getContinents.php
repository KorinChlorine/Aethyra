<?php
include "./database.php"; // database connection

// Check if continent_id is provided
if (!isset($_GET['continent_id'])) {
    echo json_encode(['error' => 'continent_id not provided']);
    exit;
}

$continent_id = (int)$_GET['continent_id'];

// Fetch the specific continent
$sql = "SELECT * FROM continents WHERE continent_id = $continent_id LIMIT 1";
$result = mysqli_query($conn, $sql);

if ($result && mysqli_num_rows($result) > 0) {
    $continent = mysqli_fetch_assoc($result); // fetch single row
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
