<?php
// Load environment variables from .env file
function loadEnv($path) {
    if (!file_exists($path)) {
        die(json_encode(['error' => '.env file not found']));
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        if (!array_key_exists($name, $_ENV)) {
            putenv("$name=$value");
            $_ENV[$name] = $value;
        }
    }
}

// Load .env file
loadEnv(__DIR__ . '/../.env');

// Database Configuration
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'muse_mandate');

// Create database connection
function getDB() {
    static $conn = null;
    
    if ($conn === null) {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        if ($conn->connect_error) {
            die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
        }
        
        $conn->set_charset("utf8mb4");
    }
    
    return $conn;
}

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start session
session_start();

// File upload paths
define('UPLOAD_PATH_TRACKS', __DIR__ . '/../assets/tracks/');
define('UPLOAD_PATH_ARTWORK', __DIR__ . '/../assets/artwork/');

// Create upload directories if they don't exist
if (!file_exists(UPLOAD_PATH_TRACKS)) {
    mkdir(UPLOAD_PATH_TRACKS, 0755, true);
}
if (!file_exists(UPLOAD_PATH_ARTWORK)) {
    mkdir(UPLOAD_PATH_ARTWORK, 0755, true);
}
?>
