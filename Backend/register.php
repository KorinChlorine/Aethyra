<?php
header('Content-Type: application/json');
require_once 'database.php';

// Create Users table if it doesn't exist
$createTableSql = "CREATE TABLE IF NOT EXISTS `Users` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `firstName` VARCHAR(100) NOT NULL,
  `lastName` VARCHAR(100) NOT NULL,
  `middleName` VARCHAR(100) DEFAULT NULL,
  `gender` VARCHAR(50) DEFAULT NULL,
  `birthDate` DATE DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `securityAnswer` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

$conn->query($createTableSql);

// Collect and validate inputs
$firstName = trim($_POST['register_first_name'] ?? '');
$middleName = trim($_POST['register_middle_name'] ?? '');
$lastName = trim($_POST['register_last_name'] ?? '');
$gender = trim($_POST['register_gender'] ?? '');
$birthDate = trim($_POST['register_birthdate'] ?? '');
$email = trim($_POST['register_email'] ?? '');
$password = $_POST['register_password'] ?? '';
$securityAnswer = trim($_POST['register_security_answer'] ?? '');

if (!$firstName || !$lastName || !$email || !$password || !$securityAnswer) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

// Basic email validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit;
}

// Check if email already exists
$stmt = $conn->prepare('SELECT id FROM Users WHERE email = ? LIMIT 1');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'error' => 'Email already registered']);
    exit;
}
$stmt->close();

// Hash password and insert
$hashed = password_hash($password, PASSWORD_BCRYPT);
$insert = $conn->prepare('INSERT INTO Users (firstName, lastName, middleName, gender, birthDate, email, password, securityAnswer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
$insert->bind_param('ssssssss', $firstName, $lastName, $middleName, $gender, $birthDate, $email, $hashed, $securityAnswer);
if ($insert->execute()) {
    echo json_encode(['success' => true, 'message' => 'Registered successfully']);
} else {
    echo json_encode(['success' => false, 'error' => 'Database insert failed']);
}
$insert->close();
$conn->close();
?>
