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

// Delete user from database
$delete = $conn->prepare('DELETE FROM users WHERE userID = ?');
$delete->bind_param('i', $userId);

if ($delete->execute()) {
    // Destroy session after successful deletion
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Account deleted successfully']);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to delete account']);
}

$delete->close();
$conn->close();
?>
