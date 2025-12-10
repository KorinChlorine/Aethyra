<?php
header('Content-Type: application/json');
session_start();

// Destroy the session
session_destroy();

echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>
