# Muse Mandate Website

## Overview
Muse Mandate is a modern, atmospheric music website designed for an electronic music producer. The website features a fullscreen hero layout, an integrated music player, and an admin page for track management.

## Features
- **Fullscreen Hero Layout**: A visually stunning introduction to the artist's music, complete with background images and animations.
- **Music Player**: A user-friendly music player that allows visitors to listen to tracks seamlessly.
- **Admin Page**: A secure admin interface for managing tracks, including uploading new music and artwork.

## Project Structure
```
muse-mandate-website
├── src
│   ├── index.html          # Main HTML file for the public-facing website
│   ├── admin.html          # Admin page for managing tracks
│   ├── css
│   │   ├── main.css        # Main styles for the website
│   │   ├── hero.css        # Styles for the fullscreen hero layout
│   │   ├── player.css      # Styles for the music player
│   │   └── admin.css       # Styles for the admin page
│   ├── js
│   │   ├── app.js          # Main JavaScript file for application initialization
│   │   ├── player.js       # Music player functionality
│   │   ├── admin.js        # Admin functionalities
│   │   └── api.js          # Functions for backend interaction
│   ├── components
│   │   ├── hero.js         # Fullscreen hero component
│   │   ├── music-player.js  # Music player component
│   │   └── track-list.js    # Playlist section component
│   └── assets
│       └── fonts           # Font files for the project
├── package.json             # npm configuration file
└── README.md                # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd muse-mandate-website
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Open `src/index.html` in your browser to view the website.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.