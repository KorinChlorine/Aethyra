<?php
header('Content-Type: application/json');
require_once 'database.php';
session_start();

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit;
}

$adminID = $_SESSION['admin_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch admin profile data
    $stmt = $conn->prepare('SELECT userID, userName, firstName, middleName, lastName, email, birthdate, gender, userPicture FROM users WHERE userID = ?');
    $stmt->bind_param('i', $adminID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'error' => 'Admin not found']);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    $user = $result->fetch_assoc();
    $stmt->close();
    
    echo json_encode([
        'success' => true,
        'data' => [
            'userID' => $user['userID'],
            'userName' => $user['userName'],
            'firstName' => $user['firstName'],
            'middleName' => $user['middleName'],
            'lastName' => $user['lastName'],
            'email' => $user['email'],
            'birthdate' => $user['birthdate'],
            'gender' => $user['gender'],
            'userPicture' => $user['userPicture']
        ]
    ]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Update admin profile data
    $firstName = trim($_POST['firstName'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $birthdate = trim($_POST['birthdate'] ?? '');
    $gender = trim($_POST['gender'] ?? '');
    
    if (!$firstName || !$email || !$birthdate || !$gender) {
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'error' => 'Invalid email']);
        exit;
    }
    
    // Check email uniqueness (if email changed)
    $checkStmt = $conn->prepare('SELECT userID FROM users WHERE email = ? AND userID != ?');
    $checkStmt->bind_param('si', $email, $adminID);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows > 0) {
        echo json_encode(['success' => false, 'error' => 'Email already in use']);
        $checkStmt->close();
        $conn->close();
        exit;
    }
    $checkStmt->close();
    
    // Update admin profile
    $userName = $firstName;
    if (isset($_POST['lastName'])) {
        $lastName = trim($_POST['lastName']);
        $userName = $firstName . ' ' . $lastName;
    } else {
        $lastName = '';
    }
    
    $updateStmt = $conn->prepare('UPDATE users SET userName = ?, firstName = ?, lastName = ?, email = ?, birthdate = ?, gender = ? WHERE userID = ?');
    $updateStmt->bind_param('ssssssi', $userName, $firstName, $lastName, $email, $birthdate, $gender, $adminID);
    
    if ($updateStmt->execute()) {
        // Update session
        $_SESSION['admin_name'] = $firstName;
        echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
    
    $updateStmt->close();
}

$conn->close();
?>
