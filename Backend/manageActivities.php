<?php
include "./database.php"; // database connection

$activity_id = intval($_POST['activity_id']); //get activity_id
$city_id = intval($_POST['city_id']);         //get city_id
$name = $conn->real_escape_string($_POST['name']);  //get activity name
$description = $conn->real_escape_string($_POST['description']); //get activity description
$location = $conn->real_escape_string($_POST['location']); //get activity location
 

$imagePath = ""; // default empty

//handle file upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {

  
    $uploadDir = "../Assets/images/activities/"; //directory to save image

    // Error handling: Create directory if path file is missing
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // dynamically create unique filename
    $fileName = time() . "_" . basename($_FILES['image']['name']);
    $targetFile = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
        $imagePath = $targetFile;
    }
}

// if activity_id = 0:  INSERT new activity
if ($activity_id == 0) {

    $sql = "INSERT INTO activities (city_id, name, description, location, image)
            VALUES ($city_id, '$name', '$description', '$location', '$imagePath')";

    if ($conn->query($sql)) {
        echo "Activity Added Successfully!";
    } else {
        echo "Error inserting: " . $conn->error;
    }
    exit;
}

// if activity_id != 0:  UPDATE existing activity
if (!empty($imagePath)) {
    // Update with new image selected
    $sql = "UPDATE activities
            SET name='$name', description='$description', location='$location', image='$imagePath'
            WHERE activity_id=$activity_id";
} else {
    // Update without image
    $sql = "UPDATE activities
            SET name='$name', description='$description', location='$location'
            WHERE activity_id=$activity_id";
}

if ($conn->query($sql)) {
    echo "Activity Updated Successfully!";
} else {
    echo "Error updating: " . $conn->error;
}

?>
