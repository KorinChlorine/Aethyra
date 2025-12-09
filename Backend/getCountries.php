<?php
include "./database.php";

header('Content-Type: application/json');


// If continent_id is provided,  fetch only by continent
if (isset($_GET['continent_id']) && $_GET['continent_id'] !== '') {
    $continent_id = (int)$_GET['continent_id'];
    $sql = "SELECT country_id, country_name, image 
            FROM countries 
            WHERE continent_id = $continent_id";
} 
// If not,  fetch ALL countries for updating dashboard
else {
    $sql = "SELECT country_id, country_name, image 
            FROM countries";
}

$result = mysqli_query($conn, $sql);
$countries = [];

while ($row = mysqli_fetch_assoc($result)) {
    $countries[] = $row;
}

echo json_encode($countries);
?>
