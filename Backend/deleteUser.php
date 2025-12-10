<?php
header('Content-Type: application/json');
require_once 'database.php';

$userID = isset($_POST['userID']) ? (int)$_POST['userID'] : 0;

if (!$userID) {
    echo json_encode(['success' => false, 'error' => 'Missing userID']);
    $conn->close();
    exit;
}

// Check if user exists
$checkStmt = $conn->prepare('SELECT userID FROM users WHERE userID = ?');
$checkStmt->bind_param('i', $userID);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'User not found']);
    $conn->close();
    exit;
}
$checkStmt->close();

// Delete user
$deleteStmt = $conn->prepare('DELETE FROM users WHERE userID = ?');
$deleteStmt->bind_param('i', $userID);

if ($deleteStmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$deleteStmt->close();
$conn->close();
?>
