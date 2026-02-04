<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Setup - Muse Mandate</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background: #0a0e27;
            color: #fff;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 { color: #667eea; }
        .success { background: #2ecc71; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .error { background: #e74c3c; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .info { background: #3498db; padding: 15px; border-radius: 5px; margin: 10px 0; }
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            margin: 20px 0;
        }
        button:hover { transform: scale(1.05); }
        pre { background: #1a1535; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>🎵 Muse Mandate - Database Setup</h1>

    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $host = 'localhost';
        $user = 'root';
        $pass = '';
        
        echo "<div class='info'>Attempting to connect to MySQL...</div>";
        
        // Try to connect without database first
        $conn = @new mysqli($host, $user, $pass);
        
        if ($conn->connect_error) {
            echo "<div class='error'><strong>Connection Failed:</strong> " . $conn->connect_error . "</div>";
            echo "<div class='info'><strong>Troubleshooting:</strong><br>";
            echo "1. Make sure XAMPP/WAMP MySQL is running<br>";
            echo "2. Check MySQL is on port 3306<br>";
            echo "3. Verify root user has no password (or update config.php)</div>";
        } else {
            echo "<div class='success'>✓ Connected to MySQL successfully!</div>";
            
            // Create database
            $sql = "CREATE DATABASE IF NOT EXISTS muse_mandate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
            if ($conn->query($sql) === TRUE) {
                echo "<div class='success'>✓ Database 'muse_mandate' created/verified</div>";
            } else {
                echo "<div class='error'>Error creating database: " . $conn->error . "</div>";
            }
            
            // Select database
            $conn->select_db('muse_mandate');
            
            // Create users table
            $sql = "CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_username (username)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
            
            if ($conn->query($sql) === TRUE) {
                echo "<div class='success'>✓ Table 'users' created</div>";
            } else {
                echo "<div class='error'>Error creating users table: " . $conn->error . "</div>";
            }
            
            // Create tracks table
            $sql = "CREATE TABLE IF NOT EXISTS tracks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                audio_file VARCHAR(255) NOT NULL,
                artwork_file VARCHAR(255) NOT NULL,
                duration INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_created (created_at DESC)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
            
            if ($conn->query($sql) === TRUE) {
                echo "<div class='success'>✓ Table 'tracks' created</div>";
            } else {
                echo "<div class='error'>Error creating tracks table: " . $conn->error . "</div>";
            }
            
            // Insert default admin user
            $hashedPassword = password_hash('admin', PASSWORD_DEFAULT);
            $sql = "INSERT INTO users (username, password, email) 
                    VALUES ('admin', '$hashedPassword', 'admin@musemandate.com')
                    ON DUPLICATE KEY UPDATE username=username";
            
            if ($conn->query($sql) === TRUE) {
                echo "<div class='success'>✓ Default admin user created (username: admin, password: admin)</div>";
            } else {
                echo "<div class='error'>Error creating admin user: " . $conn->error . "</div>";
            }
            
            echo "<div class='success'><strong>🎉 Setup Complete!</strong></div>";
            echo "<div class='info'><strong>Next Steps:</strong><br>";
            echo "1. Go to <a href='admin.html' style='color: #fff;'>admin.html</a><br>";
            echo "2. Login with username: <strong>admin</strong> and password: <strong>admin</strong><br>";
            echo "3. Start uploading your tracks!</div>";
            
            $conn->close();
        }
    } else {
        ?>
        <div class="info">
            <strong>Before you begin:</strong><br>
            1. Make sure XAMPP/WAMP is installed<br>
            2. Start Apache and MySQL from the control panel<br>
            3. Click the button below to set up the database
        </div>
        
        <form method="POST">
            <button type="submit">🚀 Setup Database Now</button>
        </form>
        
        <h3>Database Configuration:</h3>
        <pre>Host: localhost
User: root
Password: (empty)
Database: muse_mandate</pre>
        <?php
    }
    ?>
</body>
</html>
