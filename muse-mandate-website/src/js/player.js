// Music Player Module
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audio-player');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.progressBar = document.querySelector('.progress-bar');
        this.progress = document.getElementById('progress');
        this.currentTimeEl = document.getElementById('current-time');
        this.durationEl = document.getElementById('duration');
        this.trackTitleEl = document.getElementById('player-track-title');
        this.artworkEl = document.getElementById('player-artwork-img');
        
        this.playlist = [];
        this.currentTrackIndex = -1;
        this.isPlaying = false;
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Play/Pause button
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Previous/Next buttons
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        
        // Progress bar click
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('play', () => this.updatePlayButton(true));
        this.audio.addEventListener('pause', () => this.updatePlayButton(false));
    }

    loadPlaylist(tracks) {
        this.playlist = tracks;
        if (tracks.length > 0 && this.currentTrackIndex === -1) {
            this.loadTrack(0);
            // Auto-play first track
            setTimeout(() => this.play(), 500);
        }
    }

    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        this.currentTrackIndex = index;
        const track = this.playlist[index];
        
        this.audio.src = track.audioUrl;
        this.trackTitleEl.textContent = track.title;
        this.artworkEl.src = track.artworkUrl;
        this.artworkEl.alt = track.title;
        
        // Update active track in playlist
        this.updateActiveTrack();
    }

    play() {
        if (this.audio.src) {
            this.audio.play();
            this.isPlaying = true;
        }
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    nextTrack() {
        const nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(nextIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    previousTrack() {
        const prevIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(prevIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    seek(e) {
        const bounds = this.progressBar.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const percentage = x / bounds.width;
        this.audio.currentTime = percentage * this.audio.duration;
    }

    updateProgress() {
        if (this.audio.duration) {
            const percentage = (this.audio.currentTime / this.audio.duration) * 100;
            this.progress.style.width = `${percentage}%`;
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    updateDuration() {
        this.durationEl.textContent = this.formatTime(this.audio.duration);
    }

    updatePlayButton(playing) {
        this.isPlaying = playing;
        this.playPauseBtn.textContent = playing ? '⏸' : '▶';
    }

    updateActiveTrack() {
        // Remove active class from all tracks
        document.querySelectorAll('.track-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current track
        const activeTrack = document.querySelector(`[data-track-index="${this.currentTrackIndex}"]`);
        if (activeTrack) {
            activeTrack.classList.add('active');
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    playTrackByIndex(index) {
        this.loadTrack(index);
        this.play();
    }
}

// Export for use in other modules
window.MusicPlayer = MusicPlayer;
    },
    {
        title: 'Track 3',
        src: 'assets/music/track3.mp3',
        artwork: 'assets/artwork/track3.jpg'
    }
];

function loadTrack(index) {
    const track = tracks[index];
    musicPlayer.src = track.src;
    trackArtwork.src = track.artwork;
    trackTitle.textContent = track.title;
}

function playTrack() {
    musicPlayer.play();
}

function pauseTrack() {
    musicPlayer.pause();
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    playTrack();
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    playTrack();
}

playButton.addEventListener('click', playTrack);
pauseButton.addEventListener('click', pauseTrack);
nextButton.addEventListener('click', nextTrack);
prevButton.addEventListener('click', prevTrack);

loadTrack(currentTrackIndex);