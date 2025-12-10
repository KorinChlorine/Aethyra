<?php
header('Content-Type: application/json');
require_once 'database.php';
session_start();

if (!$conn) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

// Ensure admin column exists
try {
    $checkColumnSql = "ALTER TABLE users ADD COLUMN isAdmin TINYINT(1) DEFAULT 0";
    $conn->query($checkColumnSql);
} catch (Exception $e) {
    // Column already exists, ignore error
}

$email = trim($_POST['admin_email'] ?? '');
$password = $_POST['admin_password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'error' => 'Missing email or password']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Invalid email']);
    exit;
}

// Query user and check if admin
$stmt = $conn->prepare('SELECT userID, firstName, password, isAdmin FROM users WHERE email = ? LIMIT 1');
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Database error']);
    exit;
}

$stmt->bind_param('s', $email);
if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'error' => 'Query error']);
    $stmt->close();
    exit;
}

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
    $stmt->close();
    $conn->close();
    exit;
}

$user = $result->fetch_assoc();
$stmt->close();

// Check if user is admin
if (!$user['isAdmin']) {
    echo json_encode(['success' => false, 'error' => 'You do not have admin privileges']);
    $conn->close();
    exit;
}

// Verify password (supports both hashed and plaintext for backward compatibility)
$passwordValid = false;
if (password_verify($password, $user['password'])) {
    $passwordValid = true;
} elseif ($password === $user['password']) {
    // Legacy plaintext password - upgrade to hash
    $hashed = password_hash($password, PASSWORD_BCRYPT);
    $updateStmt = $conn->prepare('UPDATE users SET password = ? WHERE userID = ?');
    $updateStmt->bind_param('si', $hashed, $user['userID']);
    $updateStmt->execute();
    $updateStmt->close();
    $passwordValid = true;
}

if (!$passwordValid) {
    echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
    $conn->close();
    exit;
}

// Set session for admin
$_SESSION['admin_id'] = $user['userID'];
$_SESSION['admin_name'] = $user['firstName'];

echo json_encode(['success' => true, 'message' => 'Admin login successful']);
$conn->close();
?>
