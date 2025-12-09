<?php
    //database connection
    $db_server = "localhost";
    $db_user = "root";
    $db_pass = "";
    $db_name = "travelguide";
    $conn = "";

    $conn = mysqli_connect($db_server,$db_user, $db_pass,$db_name );

    if(!$conn){
        echo "could not connect to database";
    }
    else{
        echo "Hellooo its working";
    }
?>