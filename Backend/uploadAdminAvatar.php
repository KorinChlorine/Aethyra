<?php
header('Content-Type: application/json');
require_once 'database.php';
session_start();

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit;
}

$adminID = $_SESSION['admin_id'];

// Handle avatar upload
if (isset($_FILES['avatar'])) {
    $file = $_FILES['avatar'];
    
    // Validate file
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($file['type'], $allowedTypes)) {
        echo json_encode(['success' => false, 'error' => 'Invalid file type']);
        exit;
    }
    
    $maxSize = 5 * 1024 * 1024; // 5MB
    if ($file['size'] > $maxSize) {
        echo json_encode(['success' => false, 'error' => 'File too large']);
        exit;
    }
    
    // Create uploads directory if not exists
    $uploadDir = dirname(__FILE__) . '/../UserPictures/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Generate unique filename
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'admin_' . $adminID . '_' . time() . '.' . $ext;
    $filepath = $uploadDir . $filename;
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        // Update database with picture path
        $picturePath = 'UserPictures/' . $filename;
        $updateStmt = $conn->prepare('UPDATE users SET userPicture = ? WHERE userID = ?');
        $updateStmt->bind_param('si', $picturePath, $adminID);
        $updateStmt->execute();
        $updateStmt->close();
        
        echo json_encode(['success' => true, 'picture' => $picturePath, 'debug' => $filepath]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to upload file']);
    }
    
    $conn->close();
    exit;
}

$conn->close();
?>
