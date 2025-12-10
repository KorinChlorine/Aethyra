<?php
header('Content-Type: application/json');
require_once 'database.php';

// Add isAdmin column if it doesn't exist
$checkColumnSql = "ALTER TABLE users ADD COLUMN isAdmin TINYINT(1) DEFAULT 0";
$conn->query($checkColumnSql); // Ignore error if column already exists

// Make the first user (userID=1) an admin
$updateSql = "UPDATE users SET isAdmin = 1 WHERE userID = 1";
if ($conn->query($updateSql)) {
    echo json_encode(['success' => true, 'message' => 'Admin setup complete. User 1 is now an admin.']);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$conn->close();
?>
