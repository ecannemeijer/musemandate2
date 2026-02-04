# Quick Setup for Apache

## Option 1: Copy to htdocs (Easiest)
1. Copy the entire `muse-mandate-website` folder to your Apache htdocs directory
   - XAMPP: `C:\xampp\htdocs\`
   - WAMP: `C:\wamp64\www\`
2. Access via: `http://localhost/muse-mandate-website/src/admin.html`

## Option 2: Virtual Host (Keep current location)

### Step 1: Edit Apache config
1. Open: `C:\xampp\apache\conf\extra\httpd-vhosts.conf` (or WAMP equivalent)
2. Add the content from `apache-vhost.conf` file

### Step 2: Edit hosts file
1. Open Notepad as Administrator
2. Open: `C:\Windows\System32\drivers\etc\hosts`
3. Add this line at the bottom:
   ```
   127.0.0.1 musemandate.local
   ```

### Step 3: Restart Apache
1. Open XAMPP/WAMP Control Panel
2. Stop Apache
3. Start Apache

### Step 4: Access the site
- Main: `http://musemandate.local/src/index.html`
- Admin: `http://musemandate.local/src/admin.html`

## Current Issue
You're opening files directly in browser (file:// protocol). 
PHP needs to run through a web server (http:// protocol).

**Quick Test:**
If you already copied to htdocs, try:
`http://localhost/muse-mandate-website/src/admin.html`
