<?php
include "./database.php"; // your database connection

$spot_id = intval($_POST['spot_id']); //get spot_id
$city_id = intval($_POST['city_id']); //get city_id
$name = $conn->real_escape_string($_POST['name']); //get spot name
$history = $conn->real_escape_string($_POST['history']); //get spot history
$details = $conn->real_escape_string($_POST['details']); //get spot details

$imagePath = ""; // default empty


//handle file uload
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {

    $uploadDir = "../Assets/images/spots/"; //directory to save image

    // Create the directory if missing
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // create unique filename
    $fileName = time() . "_" . basename($_FILES['image']['name']);
    $target = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
        $imagePath = $target; // save entire path 
    }
}

// if spot_id = 0: INSERT new spots
if ($spot_id == 0) {

    $sql = "INSERT INTO tourist_spots (city_id, name, history, details, image)
            VALUES ($city_id, '$name', '$history', '$details', '$imagePath')";

    if ($conn->query($sql)) {
        echo "Tourist Spot Added Successfully!";
    } else {
        echo "Error inserting: " . $conn->error;
    }

    exit;
}

// if spot_id != 0: UPDATE existing spot
if (!empty($imagePath)) {
    // update with new image
    $sql = "UPDATE tourist_spots 
            SET name='$name', history='$history', details='$details', image='$imagePath'
            WHERE spot_id=$spot_id";
} else {
    // update WITHOUT image
    $sql = "UPDATE tourist_spots 
            SET name='$name', history='$history', details='$details'
            WHERE spot_id=$spot_id";
}

if ($conn->query($sql)) {
    echo "Tourist Spot Updated Successfully!";
} else {
    echo "Error updating: " . $conn->error;
}

?>
