<?php
include "./database.php";

header('Content-Type: application/json');

$spots = [];

// If city_id is provided =  fetch only spots in city
if (isset($_GET['city_id']) && $_GET['city_id'] !== '') {

    $city_id = (int)$_GET['city_id'];

    $sql = "SELECT spot_id, city_id, name, image, history, details
            FROM tourist_spots
            WHERE city_id = $city_id";
}

// If city_id is NOT provided = fetch ALL
else {

    $sql = "SELECT spot_id, city_id, name, image, history, details
            FROM tourist_spots";
}

$result = mysqli_query($conn, $sql);

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $spots[] = $row;
    }
}

echo json_encode($spots);
?>
