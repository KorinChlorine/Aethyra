<?php
include "./database.php"; //database connection

$country_id = (int)$_POST['country_id'];  //get country_id
$country_name = $conn->real_escape_string($_POST['country_name']); //get country_name
$continent_id = (int)$_POST['continent_id']; //get continent_id

$imagePath = "";

//handle file upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {

   
    $uploadDir = "../Assets/images/countries/"; //directory to save image

    // Create the folder if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Create unique filename
    $fileName = time() . "_" . basename($_FILES['image']['name']);
    $target = $uploadDir . $fileName;

    // Move uploaded file
    if (move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
        $imagePath = $target;   // store full path in DB
    }
}

// if country_id = 0: ADD new country
if ($country_id == 0) {

    $sql = "INSERT INTO countries (continent_id, country_name, image)
            VALUES ($continent_id, '$country_name', '$imagePath')";

    if ($conn->query($sql)) {
        echo "Country added successfully!";
    } else {
        echo "Error inserting: " . $conn->error;
    }

    exit;
}

// if country_id != 0: UPDATE existing country
if (!empty($imagePath)) {
    // update with new image
    $sql = "UPDATE countries 
            SET country_name='$country_name', image='$imagePath'
            WHERE country_id=$country_id";
} else {
    // update only name
    $sql = "UPDATE countries 
            SET country_name='$country_name'
            WHERE country_id=$country_id";
}

if ($conn->query($sql)) {
    echo "Country updated successfully!";
} else {
    echo "Error updating: " . $conn->error;
}
?>
