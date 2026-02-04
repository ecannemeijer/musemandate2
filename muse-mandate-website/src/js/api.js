// API Module - PHP Backend Integration
class MusicAPI {
    constructor() {
        this.baseURL = '../backend';
    }

    // Get all tracks
    async getTracks() {
        try {
            const response = await fetch(`${this.baseURL}/tracks.php`);
            if (!response.ok) throw new Error('Failed to fetch tracks');
            return await response.json();
        } catch (error) {
            console.error('Error loading tracks:', error);
            return [];
        }
    }

    // Add a new track (with file upload)
    async addTrack(title, audioFile, artworkFile) {
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('audio', audioFile);
            formData.append('artwork', artworkFile);

            const response = await fetch(`${this.baseURL}/tracks.php`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding track:', error);
            throw error;
        }
    }

    // Delete a track
    async deleteTrack(trackId) {
        try {
            const response = await fetch(`${this.baseURL}/tracks.php`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: trackId })
            });

            if (!response.ok) throw new Error('Failed to delete track');
            return await response.json();
        } catch (error) {
            console.error('Error deleting track:', error);
            return false;
        }
    }

    // Login
    async login(username, password) {
        try {
            const response = await fetch(`${this.baseURL}/auth.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'login',
                    username,
                    password
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Logout
    async logout() {
        try {
            const response = await fetch(`${this.baseURL}/auth.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'logout' })
            });
            return await response.json();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    // Check authentication
    async checkAuth() {
        try {
            const response = await fetch(`${this.baseURL}/auth.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'check' })
            });
            return await response.json();
        } catch (error) {
            console.error('Auth check error:', error);
            return { authenticated: false };
        }
    }
}

// Export for use in other modules
window.MusicAPI = MusicAPI;