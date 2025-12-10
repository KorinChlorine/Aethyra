<?php
header('Content-Type: application/json');
require_once 'database.php';

// Make users 1, 3, and 4 admins
$result = $conn->query('UPDATE users SET isAdmin = 1 WHERE userID IN (1, 3, 4)');

if ($result) {
    echo json_encode(['success' => true, 'message' => 'Made users 1, 3, 4 as admins']);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$conn->close();
?>
