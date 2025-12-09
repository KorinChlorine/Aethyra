<?php
include "./database.php"; // database connection

$food_id   = intval($_POST['food_id']); //get food_id
$city_id   = intval($_POST['city_id']); //get city_id
$name      = $conn->real_escape_string($_POST['name']); //get food name
$about     = $conn->real_escape_string($_POST['about']); //get about food
$location  = $conn->real_escape_string($_POST['location']); //get food location

$imagePath = ""; // default

//handle file upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {

    $uploadDir = "../Assets/images/foods/";  //directory to save image

    // Create directory if missing
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // create Unique filename
    $fileName = time() . "_" . basename($_FILES['image']['name']);
    $target   = $uploadDir . $fileName;

    // Move file
    if (move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
        $imagePath = $target;  // store full path
    }
}

// if food_id = 0: INSERT new food
if ($food_id == 0) {

    $sql = "INSERT INTO foods (city_id, name, about, location, image)
            VALUES ($city_id, '$name', '$about', '$location', '$imagePath')";

    if ($conn->query($sql)) {
        echo "Food Added Successfully!";
    } else {
        echo "Error inserting: " . $conn->error;
    }

    exit;
}

// if food_id != 0: UPDATE existing food

// Update WITH new image
if (!empty($imagePath)) {
    $sql = "UPDATE foods 
            SET name='$name', about='$about', location='$location', image='$imagePath'
            WHERE food_id=$food_id";
}
// Update WITHOUT image
else {
    $sql = "UPDATE foods 
            SET name='$name', about='$about', location='$location'
            WHERE food_id=$food_id";
}

if ($conn->query($sql)) {
    echo "Food Updated Successfully!";
} else {
    echo "Error updating: " . $conn->error;
}

?>
