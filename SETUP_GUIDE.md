# Muse Mandate - PHP Backend Setup

## Prerequisites

1. **XAMPP/WAMP/LAMP** (or any PHP server)
   - PHP 7.4 or higher
   - MySQL 5.7 or higher
   - Apache with mod_rewrite enabled

## Installation Steps

### 1. Setup Database

1. Start your MySQL server (via XAMPP/WAMP control panel)
2. Open phpMyAdmin (usually at `http://localhost/phpmyadmin`)
3. Click "Import" tab
4. Select the file: `backend/database.sql`
5. Click "Go" to import

**Or run via command line:**
```bash
mysql -u root -p < backend/database.sql
```

### 2. Configure Database Connection

Edit `backend/config.php` and update if needed:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');          // Your MySQL username
define('DB_PASS', '');              // Your MySQL password
define('DB_NAME', 'muse_mandate');
```

### 3. Setup Web Server

**Option A: Using XAMPP/WAMP**
1. Copy the entire `muse-mandate-website` folder to your server's `htdocs` folder
2. Access via: `http://localhost/muse-mandate-website/src/index.html`

**Option B: Using PHP Built-in Server (Development Only)**
```bash
cd muse-mandate-website
php -S localhost:8000
```
Then access: `http://localhost:8000/src/index.html`

### 4. Set Folder Permissions

Ensure these folders are writable:
```bash
chmod 755 src/assets/tracks
chmod 755 src/assets/artwork
```

On Windows, right-click folders → Properties → Security → Edit → Allow "Full Control"

### 5. Test the Setup

1. **Main Page**: `http://localhost/muse-mandate-website/src/index.html`
2. **Admin Page**: `http://localhost/muse-mandate-website/src/admin.html`
3. **User Management**: `http://localhost/muse-mandate-website/src/users.html`

## Default Login Credentials

**Admin User:**
- Username: `admin`
- Password: `admin`

⚠️ **IMPORTANT**: Change the default password immediately in production!

## API Endpoints

### Authentication
- `POST /backend/auth.php` - Login/Logout/Check Auth

### Tracks
- `GET /backend/tracks.php` - Get all tracks
- `POST /backend/tracks.php` - Upload new track
- `DELETE /backend/tracks.php` - Delete track

### Users
- `GET /backend/users.php` - Get all users
- `POST /backend/users.php` - Create user
- `PUT /backend/users.php` - Update user
- `DELETE /backend/users.php` - Delete user

## File Structure

```
muse-mandate-website/
├── backend/
│   ├── config.php          # Database configuration
│   ├── database.sql        # Database schema
│   ├── auth.php           # Authentication API
│   ├── tracks.php         # Tracks management API
│   └── users.php          # User management API
├── src/
│   ├── index.html         # Main public page
│   ├── admin.html         # Admin dashboard
│   ├── users.html         # User management
│   ├── assets/
│   │   ├── tracks/        # MP3 uploads folder
│   │   ├── artwork/       # Artwork uploads folder
│   │   └── images/        # Hero background image
│   ├── css/               # Stylesheets
│   └── js/                # JavaScript files
```

## Troubleshooting

### Database Connection Fails
- Check MySQL is running
- Verify credentials in `backend/config.php`
- Ensure database `muse_mandate` exists

### File Upload Fails
- Check folder permissions for `assets/tracks` and `assets/artwork`
- Check PHP upload limits in `php.ini`:
  ```ini
  upload_max_filesize = 50M
  post_max_size = 50M
  ```

### CORS Errors
- Ensure you're accessing via `http://localhost` not `file://`
- Check Apache mod_headers is enabled

### Session Issues
- Ensure session.save_path is writable
- Check PHP session settings in `php.ini`

## Security Notes

1. **Change default password** immediately
2. In production, update `backend/config.php`:
   - Use strong database password
   - Disable error display
   - Enable HTTPS only
3. Consider adding rate limiting for login attempts
4. Regular database backups

## Next Steps

1. Save your hero DJ image as `src/assets/images/hero-bg.jpg`
2. Login to admin panel
3. Upload your tracks
4. Create additional admin users if needed

Enjoy your music website! 🎵
