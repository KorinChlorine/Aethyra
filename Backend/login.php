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
$stmt = $conn->prepare('SELECT userID, firstName, password FROM users WHERE email = ? LIMIT 1');
$stmt->bind_param('s', $email);
$stmt->execute();
$res = $stmt->get_result();
if ($res && $row = $res->fetch_assoc()) {
    $stored = $row['password'];
 
    $ok = false;
    if (password_verify($password, $stored)) {
        $ok = true;
    } elseif ($stored === $password) {

        $newHash = password_hash($password, PASSWORD_BCRYPT);
        $upd = $conn->prepare('UPDATE users SET password = ? WHERE userID = ?');
        $upd->bind_param('si', $newHash, $row['userID']);
        $upd->execute();
        $upd->close();
        $ok = true;
    }

    if ($ok) {
        $_SESSION['user_id'] = $row['userID'];
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
