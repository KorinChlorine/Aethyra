<?php
header('Content-Type: application/json');
require_once 'database.php';

$userID = isset($_POST['userID']) ? (int)$_POST['userID'] : 0;
$firstName = isset($_POST['firstName']) ? trim($_POST['firstName']) : '';
$middleName = isset($_POST['middleName']) ? trim($_POST['middleName']) : '';
$lastName = isset($_POST['lastName']) ? trim($_POST['lastName']) : '';
$gender = isset($_POST['gender']) ? trim($_POST['gender']) : '';
$birthdate = isset($_POST['birthdate']) ? trim($_POST['birthdate']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';

if (!$userID || !$firstName || !$lastName || !$email || !$gender || !$birthdate) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
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

// Check if new email is unique (if email was changed)
$emailCheckStmt = $conn->prepare('SELECT userID FROM users WHERE email = ? AND userID != ?');
$emailCheckStmt->bind_param('si', $email, $userID);
$emailCheckStmt->execute();
$emailCheckResult = $emailCheckStmt->get_result();

if ($emailCheckResult->num_rows > 0) {
    echo json_encode(['success' => false, 'error' => 'Email already in use']);
    $conn->close();
    exit;
}
$emailCheckStmt->close();

// Update user
$userName = $firstName . ' ' . $lastName;
$updateStmt = $conn->prepare('UPDATE users SET userName = ?, firstName = ?, middleName = ?, lastName = ?, gender = ?, birthdate = ?, email = ? WHERE userID = ?');
$updateStmt->bind_param('sssssssi', $userName, $firstName, $middleName, $lastName, $gender, $birthdate, $email, $userID);

if ($updateStmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'User updated successfully']);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$updateStmt->close();
$conn->close();
?>
