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

// Collect inputs
$firstName = trim($_POST['firstName'] ?? '');
$middleName = trim($_POST['middleName'] ?? '');
$lastName = trim($_POST['lastName'] ?? '');
$gender = trim($_POST['gender'] ?? '');
$birthdate = trim($_POST['birthdate'] ?? '');
$email = trim($_POST['email'] ?? '');
$contactNumber = trim($_POST['contactNumber'] ?? '');
$age = trim($_POST['age'] ?? '');

// Build dynamic UPDATE query based on which fields were provided
$updates = [];
$types = '';
$params = [];

// Only add to update if value is not empty
if ($firstName) {
    $updates[] = 'firstName = ?';
    $types .= 's';
    $params[] = $firstName;
}
if ($middleName) {
    $updates[] = 'middleName = ?';
    $types .= 's';
    $params[] = $middleName;
}
if ($lastName) {
    $updates[] = 'lastName = ?';
    $types .= 's';
    $params[] = $lastName;
}
if ($gender) {
    $updates[] = 'gender = ?';
    $types .= 's';
    $params[] = $gender;
}
if ($birthdate) {
    $updates[] = 'birthdate = ?';
    $types .= 's';
    $params[] = $birthdate;
}
if ($email) {
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'error' => 'Invalid email address']);
        exit;
    }
    
    $stmt = $conn->prepare('SELECT userID FROM users WHERE email = ? AND userID != ? LIMIT 1');
    $stmt->bind_param('si', $email, $userId);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        echo json_encode(['success' => false, 'error' => 'Email already in use']);
        exit;
    }
    $stmt->close();
    
    $updates[] = 'email = ?';
    $types .= 's';
    $params[] = $email;
}

// If firstName and lastName are both provided, update userName
if ($firstName && $lastName) {
    $updates[] = 'userName = ?';
    $types .= 's';
    $params[] = trim($firstName . ' ' . $lastName);
}

// Check if any updates were provided
if (empty($updates)) {
    echo json_encode(['success' => false, 'error' => 'No fields to update']);
    exit;
}

// Add user ID to params
$types .= 'i';
$params[] = $userId;

// Build and execute the UPDATE query
$query = 'UPDATE users SET ' . implode(', ', $updates) . ' WHERE userID = ?';
$update = $conn->prepare($query);
$update->bind_param($types, ...$params);

if ($update->execute()) {
    // Update session firstName for consistency if it was changed
    if ($firstName) {
        $_SESSION['firstName'] = $firstName;
    }
    echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to update profile']);
}

$update->close();
$conn->close();
?>

