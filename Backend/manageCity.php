<?php
include "./database.php"; // DB connection

$city_id = intval($_POST['city_id']);  //get city_id
$country_id = intval($_POST['country_id']); //get country_id
$city_name = $conn->real_escape_string($_POST['name']); //get city name
$city_description = $conn->real_escape_string($_POST['description']); //get city description

// if city_id = 0:  INSERT new city
if ($city_id === 0) {

    $sql = "INSERT INTO cities (country_id, name, description)
            VALUES ( '$country_id', '$city_name', '$city_description')";

    if ($conn->query($sql)) {

        $newCityId = $conn->insert_id;

        // Insert images if uploaded
        if (!empty($_FILES['images']['name'][0])) {

            $uploadDir = "../Assets/images/cities/"; //directory to save image

            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

            foreach ($_FILES['images']['name'] as $i => $imgName) {

                if ($_FILES['images']['error'][$i] === 0) {

                    $fileName = time() . "_" . basename($imgName);
                    $target = $uploadDir . $fileName;

                    if (move_uploaded_file($_FILES['images']['tmp_name'][$i], $target)) {

                        $conn->query(
                            "INSERT INTO city_images (city_id, image_path)
                             VALUES ($newCityId, '$target')"
                        );
                    }
                }
            }
        }

        echo "City Added Successfully!";
        exit;
    } else {
        echo "Error inserting: " . $conn->error;
        exit;
    }
}

//if city_id is given: UPDATE existing city
$conn->query("
    UPDATE cities 
    SET name='$city_name', description='$city_description'
    WHERE city_id=$city_id
");

//when user edit city, and upload new image = remove old then insert new
if (!empty($_FILES['images']['name'][0])) {

    //fetch all old image
    $result = $conn->query("SELECT image_path FROM city_images WHERE city_id=$city_id");

    while ($row = $result->fetch_assoc()) {
        $oldImage = $row['image_path'];

        if (file_exists($oldImage)) {
            unlink($oldImage); // delete file
        }
    }

    // DELETE OLD IMAGE RECORDS
    $conn->query("DELETE FROM city_images WHERE city_id=$city_id");


    // INSERT NEW IMAGES
    $uploadDir = "../Assets/images/cities/";
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

    foreach ($_FILES['images']['name'] as $i => $imgName) {

        if ($_FILES['images']['error'][$i] === 0) {

            $fileName = time() . "_" . basename($imgName);
            $target = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES['images']['tmp_name'][$i], $target)) {

                $conn->query("
                    INSERT INTO city_images (city_id, image_path)
                    VALUES ($city_id, '$target')
                ");
            }
        }
    }
}

echo "City Updated Successfully!";
?>
