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
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const trackIdInput = document.getElementById('track-id');
    
    let isEditMode = false;
    
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
        const trackId = trackIdInput.value;
        
        if (!title) {
            showStatus('Please enter a track title', 'error');
            return;
        }
        
        // For new uploads, require files
        if (!isEditMode && (!trackFile || !artworkFile)) {
            showStatus('Please select both MP3 and artwork files', 'error');
            return;
        }
        
        try {
            showStatus(isEditMode ? 'Updating...' : 'Uploading...', 'info');
            
            if (isEditMode) {
                // Update existing track
                await api.updateTrack(trackId, title, trackFile, artworkFile);
                showStatus('Track updated successfully!', 'success');
                resetForm();
            } else {
                // Upload new track
                await api.addTrack(title, trackFile, artworkFile);
                showStatus('Track uploaded successfully!', 'success');
            }
            
            uploadForm.reset();
            await loadAdminTracks();
            
        } catch (error) {
            console.error('Error:', error);
            showStatus(error.message || 'Operation failed. Please try again.', 'error');
        }
    });
    
    // Cancel edit button
    cancelEditBtn.addEventListener('click', () => {
        resetForm();
    });
    
    function resetForm() {
        isEditMode = false;
        formTitle.textContent = 'Upload New Track';
        submitBtn.textContent = 'Upload Track';
        cancelEditBtn.style.display = 'none';
        trackIdInput.value = '';
        uploadForm.reset();
        document.getElementById('track-file').required = true;
        document.getElementById('artwork-file').required = true;
    }
    
    function enterEditMode(track) {
        isEditMode = true;
        formTitle.textContent = 'Edit Track';
        submitBtn.textContent = 'Update Track';
        cancelEditBtn.style.display = 'inline-block';
        trackIdInput.value = track.id;
        document.getElementById('track-title').value = track.title;
        document.getElementById('track-file').required = false;
        document.getElementById('artwork-file').required = false;
        
        // Scroll to form
        document.querySelector('.upload-section').scrollIntoView({ behavior: 'smooth' });
    }
    
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
            <div style="display: flex; gap: 10px;">
                <button class="btn-secondary btn-edit" data-track-id="${track.id}">Edit</button>
                <button class="btn-delete" data-track-id="${track.id}">Delete</button>
            </div>
        `;
        
        // Edit button
        const editBtn = trackDiv.querySelector('.btn-edit');
        editBtn.addEventListener('click', () => {
            enterEditMode(track);
        });
        
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