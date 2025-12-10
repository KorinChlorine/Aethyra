<?php
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['loggedIn' => false]);
    exit;
}

echo json_encode([
    'loggedIn' => true,
    'admin_id' => $_SESSION['admin_id'],
    'admin_name' => $_SESSION['admin_name'] ?? 'Admin'
]);
?>
