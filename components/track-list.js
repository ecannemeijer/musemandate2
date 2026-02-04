import React from 'react';

const TrackList = ({ tracks, onTrackSelect, currentTrackId }) => {
    return (
        <div className="track-list">
            <h2>Playlist</h2>
            <ul>
                {tracks.map(track => (
                    <li 
                        key={track.id} 
                        className={currentTrackId === track.id ? 'active' : ''}
                        onClick={() => onTrackSelect(track.id)}
                    >
                        <span>{track.title}</span> - <span>{track.artist}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TrackList;