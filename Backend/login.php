<?php
header('Content-Type: application/json');
require_once 'database.php';
session_start();

$email = trim($_POST['login_email'] ?? '');
$password = $_POST['login_password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'error' => 'Missing email or password']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit;
}

$stmt = $conn->prepare('SELECT id, firstName, password FROM Users WHERE email = ? LIMIT 1');
$stmt->bind_param('s', $email);
$stmt->execute();
$res = $stmt->get_result();
if ($res && $row = $res->fetch_assoc()) {
    if (password_verify($password, $row['password'])) {
        // Authentication success
        $_SESSION['user_id'] = $row['id'];
        $_SESSION['firstName'] = $row['firstName'];
        echo json_encode(['success' => true, 'message' => 'Logged in']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Incorrect password']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Email not found']);
}

$stmt->close();
$conn->close();
?>
