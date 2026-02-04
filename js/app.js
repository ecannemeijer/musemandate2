// Main Application Module
document.addEventListener('DOMContentLoaded', () => {
    const api = new MusicAPI();
    const player = new MusicPlayer();
    
    // Load and display tracks
    loadTracks();

    async function loadTracks() {
        const tracks = await api.getTracks();
        const trackListContainer = document.getElementById('track-list');
        
        // Clear existing tracks
        trackListContainer.innerHTML = '';
        
        if (tracks.length === 0) {
            trackListContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: rgba(255, 255, 255, 0.5);">
                    <p>No tracks available yet. Upload some tracks via the <a href="admin.html" style="color: #667eea;">admin panel</a>.</p>
                </div>
            `;
            return;
        }
        
        // Render each track
        tracks.forEach((track, index) => {
            const trackElement = createTrackElement(track, index);
            trackListContainer.appendChild(trackElement);
        });
        
        // Load playlist into player
        player.loadPlaylist(tracks);
    }

    function createTrackElement(track, index) {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'track-item';
        trackDiv.setAttribute('data-track-index', index);
        
        trackDiv.innerHTML = `
            <div class="track-artwork">
                <img src="${track.artworkUrl}" alt="${track.title}">
            </div>
            <div class="track-info">
                <div class="track-title">${track.title}</div>
            </div>
        `;
        
        // Click to play track
        trackDiv.addEventListener('click', () => {
            player.playTrackByIndex(index);
        });
        
        return trackDiv;
    }
});