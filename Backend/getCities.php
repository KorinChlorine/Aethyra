<?php
include "./database.php"; // database connection

// If city_id is provided, fetch that specific city
if (isset($_GET['city_id']) && $_GET['city_id'] !== '') {
    $city_id = (int)$_GET['city_id'];
    $sql = "SELECT * FROM cities WHERE city_id = $city_id LIMIT 1";
    $result = mysqli_query($conn, $sql);

    if ($result && mysqli_num_rows($result) > 0) {
        $city = mysqli_fetch_assoc($result);
        echo json_encode([
            "status" => "success",
            "data" => $city
        ]);
    } else {
        echo json_encode([
            "status" => "empty",
            "message" => "City not found"
        ]);
    }
    exit;
}

// Otherwise, fetch all cities for the country
if (!isset($_GET['country_id'])) {
    echo json_encode(['error' => 'country_id not provided']);
    exit;
}

$country_id = (int)$_GET['country_id'];
$sql = "SELECT * FROM cities WHERE country_id = $country_id";
$result = mysqli_query($conn, $sql);

$cities = [];
while ($row = mysqli_fetch_assoc($result)) {
    $cities[] = $row;
}

if (empty($cities)) {
    echo json_encode([
        "status" => "empty",
        "message" => "No cities available"
    ]);
    exit;
}

echo json_encode([
    "status" => "success",
    "data" => $cities
]);
?>
