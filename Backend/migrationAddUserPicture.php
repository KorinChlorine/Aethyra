<?php
header('Content-Type: application/json');
require_once 'database.php';

// Add userPicture column if it doesn't exist
try {
    $conn->query("ALTER TABLE users ADD COLUMN userPicture VARCHAR(255) DEFAULT NULL");
    echo json_encode(['success' => true, 'message' => 'userPicture column added']);
} catch (Exception $e) {
    // Column already exists or other error
    echo json_encode(['success' => true, 'message' => 'Column already exists or update not needed']);
}

$conn->close();
?>
