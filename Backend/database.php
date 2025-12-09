<?php
$servername = "localhost";
$username = "root";
$password = ""; // XAMPP default has no password
$dbname = "travelguide";

$conn = new mysqli($servername, $username, $password, $dbname, 3306);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
?>
