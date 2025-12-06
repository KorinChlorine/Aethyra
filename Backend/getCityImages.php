<?php
include "./database.php"; // database connection

// Check if city_id is provided
if (!isset($_GET['city_id'])) {
    echo json_encode([
        "status" => "error",
        "message" => "city_id not provided"
    ]);
    exit;
}

$city_id = (int)$_GET['city_id'];

// Fetch all images for this city
$sql = "SELECT image_id, city_id, image_path FROM city_images WHERE city_id = $city_id";
$result = mysqli_query($conn, $sql);

$images = [];
while ($row = mysqli_fetch_assoc($result)) {
    $images[] = $row;
}

if (empty($images)) {
    echo json_encode([
        "status" => "empty",
        "message" => "No images found for this city"
    ]);
    exit;
}
// Return as JSON
echo json_encode([
    "city" => $images
]);
?>
