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
$currentPassword = $_POST['currentPassword'] ?? '';
$newPassword = $_POST['newPassword'] ?? '';

if (!$currentPassword || !$newPassword) {
    echo json_encode(['success' => false, 'error' => 'Missing password fields']);
    exit;
}

// Fetch current password hash from DB
$stmt = $conn->prepare('SELECT password FROM users WHERE userID = ? LIMIT 1');
$stmt->bind_param('i', $userId);
$stmt->execute();
$res = $stmt->get_result();
if (!$res || !($row = $res->fetch_assoc())) {
    echo json_encode(['success' => false, 'error' => 'User not found']);
    exit;
}
$stmt->close();

// Verify current password
if (!password_verify($currentPassword, $row['password']) && $row['password'] !== $currentPassword) {
    echo json_encode(['success' => false, 'error' => 'Current password is incorrect']);
    exit;
}

// Hash new password
$newHash = password_hash($newPassword, PASSWORD_BCRYPT);

// Update password in DB
$update = $conn->prepare('UPDATE users SET password = ? WHERE userID = ?');
$update->bind_param('si', $newHash, $userId);

if ($update->execute()) {
    echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to change password']);
}

$update->close();
$conn->close();
?>
