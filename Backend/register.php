<?php
header('Content-Type: application/json');
require_once 'database.php';

$createTableSql = "CREATE TABLE IF NOT EXISTS `users` (
  `userID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userName` VARCHAR(100) DEFAULT NULL,
  `firstName` VARCHAR(100) DEFAULT NULL,
  `middleName` VARCHAR(100) DEFAULT NULL,
  `lastName` VARCHAR(100) DEFAULT NULL,
  `gender` VARCHAR(50) DEFAULT NULL,
  `birthdate` DATE DEFAULT NULL,
    `age` INT DEFAULT NULL,
    `contactNum` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `secAnswer` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

$conn->query($createTableSql);

$firstName = trim($_POST['register_first_name'] ?? '');
$middleName = trim($_POST['register_middle_name'] ?? '');
$lastName = trim($_POST['register_last_name'] ?? '');
$gender = trim($_POST['register_gender'] ?? '');
$birthdate = trim($_POST['register_birthdate'] ?? '');
$age = trim($_POST['register_age'] ?? null);
$contactNum = trim($_POST['register_contactNumber'] ?? null);
$email = trim($_POST['register_email'] ?? '');
$password = $_POST['register_password'] ?? '';

if (!$firstName || !$lastName || !$email || !$password) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

// Basic email validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit;
}

// Check if email already exists
$stmt = $conn->prepare('SELECT userID FROM users WHERE email = ? LIMIT 1');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'error' => 'Email already registered']);
    exit;
}
$stmt->close();

$userName = trim($firstName . ' ' . $lastName);

// Hash password
$hashed = password_hash($password, PASSWORD_BCRYPT);
// include age and contactNum if provided
$insert = $conn->prepare('INSERT INTO users (userName, firstName, middleName, lastName, gender, birthdate, email, password, age, contactNum) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
$insert->bind_param('ssssssssss', $userName, $firstName, $middleName, $lastName, $gender, $birthdate, $email, $hashed, $age, $contactNum);
if ($insert->execute()) {
    echo json_encode(['success' => true, 'message' => 'Registered successfully']);
} else {
    echo json_encode(['success' => false, 'error' => 'Database insert failed']);
}
$insert->close();
$conn->close();
?>
