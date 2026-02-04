import React from 'react';
import './hero.css';

const Hero = () => {
    return (
        <div className="hero">
            <div className="hero-content">
                <h1>Muse Mandate</h1>
                <p>Experience the sound of the future</p>
                <a href="#music" className="btn">Listen Now</a>
            </div>
        </div>
    );
};

export default Hero;