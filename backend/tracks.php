<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getTracks();
        break;
    case 'POST':
        // Check if this is an update (has 'id' and 'update' fields) or new upload
        if (isset($_POST['update']) && isset($_POST['id'])) {
            updateTrack();
        } else {
            uploadTrack();
        }
        break;
    case 'PUT':
        updateTrack();
        break;
    case 'DELETE':
        deleteTrack();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}

function getTracks() {
    $db = getDB();
    $result = $db->query("SELECT * FROM tracks ORDER BY created_at DESC");
    
    $tracks = [];
    while ($row = $result->fetch_assoc()) {
        $tracks[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'audioUrl' => 'assets/tracks/' . $row['audio_file'],
            'artworkUrl' => 'assets/artwork/' . $row['artwork_file'],
            'duration' => $row['duration'],
            'createdAt' => $row['created_at']
        ];
    }
    
    echo json_encode($tracks);
}

function uploadTrack() {
    // Check authentication
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
    
    $title = $_POST['title'] ?? '';
    
    if (empty($title)) {
        http_response_code(400);
        echo json_encode(['error' => 'Title is required']);
        exit();
    }
    
    // Handle audio file upload
    if (!isset($_FILES['audio']) || $_FILES['audio']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'Audio file upload failed']);
        exit();
    }
    
    // Handle artwork file upload
    if (!isset($_FILES['artwork']) || $_FILES['artwork']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'Artwork file upload failed']);
        exit();
    }
    
    // Validate file types
    $audioFile = $_FILES['audio'];
    $artworkFile = $_FILES['artwork'];
    
    $audioExt = strtolower(pathinfo($audioFile['name'], PATHINFO_EXTENSION));
    $artworkExt = strtolower(pathinfo($artworkFile['name'], PATHINFO_EXTENSION));
    
    if ($audioExt !== 'mp3') {
        http_response_code(400);
        echo json_encode(['error' => 'Only MP3 files are allowed for audio']);
        exit();
    }
    
    if (!in_array($artworkExt, ['jpg', 'jpeg', 'png'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Only JPG/PNG files are allowed for artwork']);
        exit();
    }
    
    // Generate unique filenames
    $audioFileName = uniqid() . '_' . time() . '.mp3';
    $artworkFileName = uniqid() . '_' . time() . '.' . $artworkExt;
    
    $audioPath = UPLOAD_PATH_TRACKS . $audioFileName;
    $artworkPath = UPLOAD_PATH_ARTWORK . $artworkFileName;
    
    // Move uploaded files
    if (!move_uploaded_file($audioFile['tmp_name'], $audioPath)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save audio file']);
        exit();
    }
    
    if (!move_uploaded_file($artworkFile['tmp_name'], $artworkPath)) {
        unlink($audioPath); // Clean up audio file
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save artwork file']);
        exit();
    }
    
    // Get audio duration (requires getID3 library or ffmpeg, simplified here)
    $duration = 0; // You can implement duration detection with getID3 or ffmpeg
    
    // Save to database
    $db = getDB();
    $stmt = $db->prepare("INSERT INTO tracks (title, audio_file, artwork_file, duration) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $title, $audioFileName, $artworkFileName, $duration);
    
    if ($stmt->execute()) {
        $trackId = $stmt->insert_id;
        echo json_encode([
            'success' => true,
            'track' => [
                'id' => $trackId,
                'title' => $title,
                'audioUrl' => 'assets/tracks/' . $audioFileName,
                'artworkUrl' => 'assets/artwork/' . $artworkFileName,
                'duration' => $duration
            ]
        ]);
    } else {
        // Clean up files on database error
        unlink($audioPath);
        unlink($artworkPath);
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save track to database']);
    }
    
    $stmt->close();
}

function updateTrack() {
    // Check authentication
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
    
    $trackId = $_POST['id'] ?? 0;
    $title = $_POST['title'] ?? '';
    
    if ($trackId <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid track ID']);
        exit();
    }
    
    if (empty($title)) {
        http_response_code(400);
        echo json_encode(['error' => 'Title is required']);
        exit();
    }
    
    $db = getDB();
    
    // Get existing track data
    $stmt = $db->prepare("SELECT audio_file, artwork_file FROM tracks WHERE id = ?");
    $stmt->bind_param("i", $trackId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Track not found']);
        exit();
    }
    
    $existingTrack = $result->fetch_assoc();
    $stmt->close();
    
    $audioFileName = $existingTrack['audio_file'];
    $artworkFileName = $existingTrack['artwork_file'];
    
    // Handle new audio file if provided
    if (isset($_FILES['audio']) && $_FILES['audio']['error'] === UPLOAD_ERR_OK) {
        $audioFile = $_FILES['audio'];
        $audioExt = strtolower(pathinfo($audioFile['name'], PATHINFO_EXTENSION));
        
        if ($audioExt !== 'mp3') {
            http_response_code(400);
            echo json_encode(['error' => 'Only MP3 files are allowed for audio']);
            exit();
        }
        
        $newAudioFileName = uniqid() . '_' . time() . '.mp3';
        $audioPath = UPLOAD_PATH_TRACKS . $newAudioFileName;
        
        if (move_uploaded_file($audioFile['tmp_name'], $audioPath)) {
            // Delete old audio file
            $oldAudioPath = UPLOAD_PATH_TRACKS . $audioFileName;
            if (file_exists($oldAudioPath)) {
                unlink($oldAudioPath);
            }
            $audioFileName = $newAudioFileName;
        }
    }
    
    // Handle new artwork file if provided
    if (isset($_FILES['artwork']) && $_FILES['artwork']['error'] === UPLOAD_ERR_OK) {
        $artworkFile = $_FILES['artwork'];
        $artworkExt = strtolower(pathinfo($artworkFile['name'], PATHINFO_EXTENSION));
        
        if (!in_array($artworkExt, ['jpg', 'jpeg', 'png'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Only JPG/PNG files are allowed for artwork']);
            exit();
        }
        
        $newArtworkFileName = uniqid() . '_' . time() . '.' . $artworkExt;
        $artworkPath = UPLOAD_PATH_ARTWORK . $newArtworkFileName;
        
        if (move_uploaded_file($artworkFile['tmp_name'], $artworkPath)) {
            // Delete old artwork file
            $oldArtworkPath = UPLOAD_PATH_ARTWORK . $artworkFileName;
            if (file_exists($oldArtworkPath)) {
                unlink($oldArtworkPath);
            }
            $artworkFileName = $newArtworkFileName;
        }
    }
    
    // Update database
    $stmt = $db->prepare("UPDATE tracks SET title = ?, audio_file = ?, artwork_file = ? WHERE id = ?");
    $stmt->bind_param("sssi", $title, $audioFileName, $artworkFileName, $trackId);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'track' => [
                'id' => $trackId,
                'title' => $title,
                'audioUrl' => 'assets/tracks/' . $audioFileName,
                'artworkUrl' => 'assets/artwork/' . $artworkFileName
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update track']);
    }
    
    $stmt->close();
}

function deleteTrack() {
    // Check authentication
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $trackId = $data['id'] ?? 0;
    
    if ($trackId <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid track ID']);
        exit();
    }
    
    $db = getDB();
    
    // Get file names before deleting
    $stmt = $db->prepare("SELECT audio_file, artwork_file FROM tracks WHERE id = ?");
    $stmt->bind_param("i", $trackId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Track not found']);
        exit();
    }
    
    $track = $result->fetch_assoc();
    $stmt->close();
    
    // Delete from database
    $stmt = $db->prepare("DELETE FROM tracks WHERE id = ?");
    $stmt->bind_param("i", $trackId);
    
    if ($stmt->execute()) {
        // Delete files
        $audioPath = UPLOAD_PATH_TRACKS . $track['audio_file'];
        $artworkPath = UPLOAD_PATH_ARTWORK . $track['artwork_file'];
        
        if (file_exists($audioPath)) {
            unlink($audioPath);
        }
        if (file_exists($artworkPath)) {
            unlink($artworkPath);
        }
        
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete track']);
    }
    
    $stmt->close();
}
?>
