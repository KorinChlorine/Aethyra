<?php
header('Content-Type: application/json');
require_once 'database.php';

$query = "SELECT userID, userName, firstName, middleName, lastName, email, birthdate, gender, age, contactNum FROM users WHERE isAdmin = 0 ORDER BY userID DESC";
$result = $conn->query($query);

if (!$result) {
    echo json_encode(['error' => $conn->error]);
    $conn->close();
    exit;
}

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = [
        'userID' => (int)$row['userID'],
        'userName' => $row['userName'],
        'firstName' => $row['firstName'],
        'middleName' => $row['middleName'],
        'lastName' => $row['lastName'],
        'email' => $row['email'],
        'birthdate' => $row['birthdate'],
        'gender' => $row['gender'],
        'age' => isset($row['age']) ? ($row['age'] === null ? null : (int)$row['age']) : null,
        'contactNum' => isset($row['contactNum']) ? $row['contactNum'] : null
    ];
}

$conn->close();
echo json_encode($users);
?>
