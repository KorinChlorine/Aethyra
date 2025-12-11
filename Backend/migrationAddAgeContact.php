<?php
header('Content-Type: application/json');
require_once 'database.php';

// Add age and contactNum columns if they don't exist
try {
    $conn->query("ALTER TABLE users ADD COLUMN age INT DEFAULT NULL, ADD COLUMN contactNum VARCHAR(50) DEFAULT NULL");
    echo json_encode(['success' => true, 'message' => 'age and contactNum columns added']);
} catch (Exception $e) {
    echo json_encode(['success' => true, 'message' => 'Columns already exist or update not needed']);
}

$conn->close();
?>
