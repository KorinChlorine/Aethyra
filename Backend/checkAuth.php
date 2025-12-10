<?php
header('Content-Type: application/json');
session_start();

// Check if user is logged in
if (isset($_SESSION['user_id'])) {
    echo json_encode(['loggedIn' => true, 'user_id' => $_SESSION['user_id'], 'firstName' => $_SESSION['firstName'] ?? '']);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>
