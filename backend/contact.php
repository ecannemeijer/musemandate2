<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getContacts();
        break;
    case 'POST':
        submitContact();
        break;
    case 'DELETE':
        deleteContact();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}

function getContacts() {
    // Check authentication
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
    
    $db = getDB();
    $result = $db->query("SELECT * FROM contacts ORDER BY created_at DESC");
    
    $contacts = [];
    while ($row = $result->fetch_assoc()) {
        $contacts[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'message' => $row['message'],
            'createdAt' => $row['created_at']
        ];
    }
    
    echo json_encode($contacts);
}

function submitContact() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $message = $data['message'] ?? '';
    
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required']);
        exit();
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email address']);
        exit();
    }
    
    $db = getDB();
    $stmt = $db->prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $message);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Contact message sent successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save contact message']);
    }
    
    $stmt->close();
}

function deleteContact() {
    // Check authentication
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $contactId = $data['id'] ?? 0;
    
    if ($contactId <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid contact ID']);
        exit();
    }
    
    $db = getDB();
    $stmt = $db->prepare("DELETE FROM contacts WHERE id = ?");
    $stmt->bind_param("i", $contactId);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete contact']);
    }
    
    $stmt->close();
}
?>
