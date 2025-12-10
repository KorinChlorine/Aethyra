<?php
header('Content-Type: application/json');
require_once 'database.php';

$email = trim($_POST['reset_email'] ?? '');
$newPassword = $_POST['reset_password'] ?? '';

if (!$email || !$newPassword) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Invalid email']);
    exit;
}

if (strlen($newPassword) < 6) {
    echo json_encode(['success' => false, 'error' => 'Password too short']);
    exit;
}

// Ensure user exists
$stmt = $conn->prepare('SELECT userID FROM users WHERE email = ? LIMIT 1');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'User not found']);
    exit;
}
$stmt->close();

// Hash and update password
$hashed = password_hash($newPassword, PASSWORD_BCRYPT);
$update = $conn->prepare('UPDATE users SET password = ? WHERE email = ?');
$update->bind_param('ss', $hashed, $email);
if ($update->execute()) {
    echo json_encode(['success' => true, 'message' => 'Password updated']);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to update password']);
}
$update->close();
$conn->close();
?>
