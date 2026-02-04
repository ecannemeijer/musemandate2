// Admin Module
document.addEventListener('DOMContentLoaded', () => {
    const api = new MusicAPI();
    
    const loginContainer = document.getElementById('login-container');
    const adminDashboard = document.getElementById('admin-dashboard');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const uploadForm = document.getElementById('upload-form');
    const uploadStatus = document.getElementById('upload-status');
    const logoutBtn = document.getElementById('logout-btn');
    const adminTrackList = document.getElementById('admin-track-list');
    
    // Check if already logged in
    checkAuth();
    
    async function checkAuth() {
        const authData = await api.checkAuth();
        if (authData.authenticated) {
            showDashboard();
        }
    }
    
    // Login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        console.log('Login attempt:', { username });
        
        try {
            const result = await api.login(username, password);
            console.log('✓ Login successful!');
            showDashboard();
            loginError.textContent = '';
        } catch (error) {
            console.log('✗ Login failed!');
            loginError.textContent = error.message || 'Invalid username or password';
            loginError.style.display = 'block';
        }
    });
    
    // Logout button
    logoutBtn.addEventListener('click', async () => {
        await api.logout();
        hideDashboard();
    });
    
    // Upload form submission
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('track-title').value;
        const trackFile = document.getElementById('track-file').files[0];
        const artworkFile = document.getElementById('artwork-file').files[0];
        
        if (!title || !trackFile || !artworkFile) {
            showStatus('Please fill in all fields', 'error');
            return;
        }
        
        try {
            showStatus('Uploading...', 'info');
            
            // Upload track using PHP API
            const result = await api.addTrack(title, trackFile, artworkFile);
            
            showStatus('Track uploaded successfully!', 'success');
            uploadForm.reset();
            await loadAdminTracks();
            
        } catch (error) {
            console.error('Upload error:', error);
            showStatus(error.message || 'Upload failed. Please try again.', 'error');
        }
    });
    
    function showDashboard() {
        loginContainer.style.display = 'none';
        adminDashboard.style.display = 'block';
        loadAdminTracks();
    }
    
    function hideDashboard() {
        loginContainer.style.display = 'flex';
        adminDashboard.style.display = 'none';
    }
    
    async function loadAdminTracks() {
        const tracks = await api.getTracks();
        adminTrackList.innerHTML = '';
        
        if (tracks.length === 0) {
            adminTrackList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: rgba(255, 255, 255, 0.5);">
                    <p>No tracks uploaded yet.</p>
                </div>
            `;
            return;
        }
        
        tracks.forEach(track => {
            const trackElement = createAdminTrackElement(track);
            adminTrackList.appendChild(trackElement);
        });
    }
    
    function createAdminTrackElement(track) {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'admin-track-item';
        
        trackDiv.innerHTML = `
            <div class="admin-track-info">
                <img src="${track.artworkUrl}" alt="${track.title}">
                <div>
                    <h4>${track.title}</h4>
                    <p style="color: rgba(255, 255, 255, 0.5); font-size: 0.9rem;">
                        Uploaded: ${new Date(track.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <button class="btn-delete" data-track-id="${track.id}">Delete</button>
        `;
        
        // Delete button
        const deleteBtn = trackDiv.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', async () => {
            if (confirm(`Delete "${track.title}"?`)) {
                await api.deleteTrack(track.id);
                await loadAdminTracks();
                showStatus('Track deleted successfully', 'success');
            }
        });
        
        return trackDiv;
    }
    
    function showStatus(message, type) {
        uploadStatus.textContent = message;
        uploadStatus.className = type === 'error' ? 'error-message' : 'status-message';
        uploadStatus.style.display = 'block';
        
        setTimeout(() => {
            uploadStatus.style.display = 'none';
        }, 5000);
    }
});

// Additional admin functionalities can be added here.