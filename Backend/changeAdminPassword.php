<?php
header('Content-Type: application/json');
require_once 'database.php';
session_start();

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit;
}

$adminID = $_SESSION['admin_id'];
$currentPassword = $_POST['current_password'] ?? '';
$newPassword = $_POST['new_password'] ?? '';
$confirmPassword = $_POST['confirm_password'] ?? '';

if (!$currentPassword || !$newPassword || !$confirmPassword) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

if ($newPassword !== $confirmPassword) {
    echo json_encode(['success' => false, 'error' => 'New passwords do not match']);
    exit;
}

if (strlen($newPassword) < 6) {
    echo json_encode(['success' => false, 'error' => 'Password must be at least 6 characters']);
    exit;
}

// Get current password from database
$stmt = $conn->prepare('SELECT password FROM users WHERE userID = ?');
$stmt->bind_param('i', $adminID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'User not found']);
    $stmt->close();
    $conn->close();
    exit;
}

$user = $result->fetch_assoc();
$stmt->close();

// Verify current password
$passwordValid = false;
if (password_verify($currentPassword, $user['password'])) {
    $passwordValid = true;
} elseif ($currentPassword === $user['password']) {
    // Legacy plaintext password
    $passwordValid = true;
}

if (!$passwordValid) {
    echo json_encode(['success' => false, 'error' => 'Current password is incorrect']);
    $conn->close();
    exit;
}

// Hash new password
$hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

// Update password
$updateStmt = $conn->prepare('UPDATE users SET password = ? WHERE userID = ?');
$updateStmt->bind_param('si', $hashedPassword, $adminID);

if ($updateStmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$updateStmt->close();
$conn->close();
?>
