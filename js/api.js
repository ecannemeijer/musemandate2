// API Module - PHP Backend Integration
class MusicAPI {
    constructor() {
        // Derive base path dynamically so the API works when the site is hosted under
        // different folder names like /musemandate/ or /musemandate2/
        const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
        const projectBase = firstSegment ? `/${firstSegment}` : '';
        this.baseURL = `${projectBase}/backend`;
    }

    // Get all tracks
    async getTracks() {
        try {
            const response = await fetch(`${this.baseURL}/tracks.php`);
            if (!response.ok) {
                const text = await response.text();
                console.error('getTracks failed: server returned non-OK response:', response.status, text);
                throw new Error('Failed to fetch tracks');
            }
            try {
                return await response.json();
            } catch (parseError) {
                const text = await response.text();
                console.error('Failed to parse JSON from getTracks, server returned:', text);
                throw parseError;
            }
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

    // Update a track
    async updateTrack(trackId, title, audioFile, artworkFile) {
        try {
            const formData = new FormData();
            formData.append('id', trackId);
            formData.append('title', title);
            formData.append('update', 'true');
            if (audioFile) formData.append('audio', audioFile);
            if (artworkFile) formData.append('artwork', artworkFile);

            const response = await fetch(`${this.baseURL}/tracks.php`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Update failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating track:', error);
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

    // Submit contact form
    async submitContact(name, email, message) {
        try {
            const response = await fetch(`${this.baseURL}/contact.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to send message');
            }

            return await response.json();
        } catch (error) {
            console.error('Contact error:', error);
            throw error;
        }
    }

    // Get all contacts (admin only)
    async getContacts() {
        try {
            const response = await fetch(`${this.baseURL}/contact.php`);
            if (!response.ok) throw new Error('Failed to fetch contacts');
            return await response.json();
        } catch (error) {
            console.error('Error loading contacts:', error);
            return [];
        }
    }

    // Delete contact message
    async deleteContact(contactId) {
        try {
            const response = await fetch(`${this.baseURL}/contact.php`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: contactId })
            });

            if (!response.ok) throw new Error('Failed to delete contact');
            return await response.json();
        } catch (error) {
            console.error('Error deleting contact:', error);
            return false;
        }
    }
}

// Export for use in other modules
window.MusicAPI = MusicAPI;