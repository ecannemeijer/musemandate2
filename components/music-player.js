import React, { useState, useEffect } from 'react';
import './player.css';

const MusicPlayer = ({ tracks, onTrackChange }) => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = React.createRef();

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        const handleTrackEnd = () => {
            setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
        };

        audioRef.current.addEventListener('ended', handleTrackEnd);
        return () => {
            audioRef.current.removeEventListener('ended', handleTrackEnd);
        };
    }, [tracks]);

    useEffect(() => {
        onTrackChange(tracks[currentTrackIndex]);
    }, [currentTrackIndex, onTrackChange, tracks]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleTrackChange = (index) => {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
    };

    return (
        <div className="music-player">
            <audio ref={audioRef} src={tracks[currentTrackIndex].src} />
            <div className="track-info">
                <h2>{tracks[currentTrackIndex].title}</h2>
                <h3>{tracks[currentTrackIndex].artist}</h3>
            </div>
            <button onClick={handlePlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
            <div className="track-list">
                {tracks.map((track, index) => (
                    <div
                        key={index}
                        className={`track-item ${index === currentTrackIndex ? 'active' : ''}`}
                        onClick={() => handleTrackChange(index)}
                    >
                        {track.title} - {track.artist}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MusicPlayer;