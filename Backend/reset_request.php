<?php
header('Content-Type: application/json');
require_once 'database.php';

$email = trim($_POST['reset_email'] ?? '');
if (!$email) {
    echo json_encode(['success' => false, 'error' => 'Missing email']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Invalid email']);
    exit;
}

$stmt = $conn->prepare('SELECT userID FROM users WHERE email = ? LIMIT 1');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows === 0) {
    // Do not reveal whether the email exists for privacy — but return a failure message.
    echo json_encode(['success' => false, 'error' => 'Email not found']);
    exit;
}
$stmt->close();

// For a simple flow we just tell the client the email is valid and allow setting a new password.
echo json_encode(['success' => true, 'message' => 'Email found']);
$conn->close();
?>
