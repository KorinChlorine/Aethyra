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
   
    echo json_encode(['success' => false, 'error' => 'Email not found']);
    exit;
}
$stmt->close();

echo json_encode(['success' => true, 'message' => 'Email found']);
$conn->close();
?>
