<?php
header('Content-Type: application/json');
require_once 'database.php';
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'User not logged in']);
    exit;
}

$userId = $_SESSION['user_id'];

// Fetch user data from database
$stmt = $conn->prepare('SELECT userID, userName, firstName, middleName, lastName, gender, birthdate, email FROM users WHERE userID = ? LIMIT 1');
$stmt->bind_param('i', $userId);
$stmt->execute();
$res = $stmt->get_result();

if ($res && $row = $res->fetch_assoc()) {
    echo json_encode(['success' => true, 'data' => $row]);
} else {
    echo json_encode(['success' => false, 'error' => 'User not found']);
}

$stmt->close();
$conn->close();
?>
