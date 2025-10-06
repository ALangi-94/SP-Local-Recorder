# SP Local Recorder

A simple, local browser-based screen recorder for creating demos, training videos, and walkthroughs. All recordings stay on your machine - no cloud uploads.

> **Important:**
> For the best experience, open the recorder in a browser window you do **not** plan to share or record.
> **Keep the recorder tab open and active during your recording.**
> If you interact with another tab in the same browser window, the recording may freeze or stop.

## Features

- **Screen Recording**
  - Record full screen, specific windows, or tabs
  - Choose from multiple screens/windows via browser picker
  - Support for 1080p (Full HD) and 4K (Ultra HD) quality

- **Webcam Overlay**
  - Toggle webcam on/off
  - Customizable position (4 corners)
  - Adjustable size (10-40% of screen)
  - Multiple shapes: square, rounded, or circle

- **Audio Recording**
  - Toggle audio on/off
  - Select from available microphones
  - High-quality audio capture with echo cancellation

- **Recording Controls**
  - Start, pause, and stop recording
  - Real-time preview
  - Recording timer

- **Output Options**
  - Saves as WebM format (always)
  - Optional MP4 conversion using browser-based FFmpeg
  - Toggle MP4 conversion on/off
  - Both files download separately when MP4 is enabled
  - Custom filename support

## System Requirements

- **Operating System**: macOS 10.13+, Windows 10+, or modern Linux
- **Browser**: Chrome, Edge, or any Chromium-based browser (latest version recommended)
- **Node.js**: Version 18 or higher (for running the development server)
- **RAM**: 4GB minimum, 8GB recommended for 4K recording
- **Disk Space**: 100MB for application + space for recordings

## Installation

### Quick Installation (Recommended)

**macOS/Linux:**
```bash
git clone https://github.com/YOUR-USERNAME/sp-local-recorder.git
cd sp-local-recorder
./install.sh
```

**Windows:**
```bash
git clone https://github.com/YOUR-USERNAME/sp-local-recorder.git
cd sp-local-recorder
install.bat
```

The installation script will:
1. Check if Node.js is installed (required)
2. Install all npm dependencies automatically
3. Confirm when ready to run

### Manual Installation

If you prefer to install manually or already have Node.js:

1. **Install Node.js** (if not already installed):
   - Download from [nodejs.org](https://nodejs.org/) (v18 or higher)
   - Or use a package manager:
     - macOS: `brew install node`
     - Windows: `choco install nodejs`
     - Linux: `sudo apt install nodejs npm` (Ubuntu/Debian)

2. **Clone the repository:**
```bash
git clone https://github.com/YOUR-USERNAME/sp-local-recorder.git
cd sp-local-recorder
```

3. **Install dependencies:**
```bash
npm install
```

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will open at `http://localhost:5173` in your default browser.

> **Note:** Keep the terminal window open while using the application. The server must remain running.

## How to Use

> **Tip:**
> Open the recorder in a browser window you do **not** intend to share or record.
> Keep the recorder tab open and do not switch to other tabs in the same window while recording.
> If you switch tabs or close the recorder tab, the recording may freeze or stop.

1. **Launch the application** (`npm run dev`)

2. **Configure your recording settings:**
   - **Screen Capture**: When you click Start Recording, your browser will prompt you to choose which screen, window, or tab to record
   - **Webcam**: Toggle on/off, adjust position, size, and shape
   - **Audio**: Enable/disable and select microphone
   - **Quality**: Choose between 1080p or 4K
   - **Save Location**: Click "Browse" to generate a timestamped filename (files will download to your browser's default download folder)
   - **MP4 Conversion**: Choose whether to save an MP4 version in addition to WebM

3. **Start Recording:**
   - Click "Start Recording"
   - Select which screen/window/tab to share in the browser picker
   - The preview window will show your recording in real-time

4. **Control Recording:**
   - **Pause/Resume**: Click to pause and resume
   - **Stop**: Click to stop and save the recording

5. **Save:**
   - WebM file will download immediately
   - If MP4 conversion is enabled, you'll see a progress overlay
   - MP4 file will download automatically when conversion completes
   - Both files will have the same base filename

## Keyboard Shortcuts

Currently, all controls are via the UI. Keyboard shortcuts can be added in future versions.

## Platform Support

- **macOS**: Fully supported and tested
- **Windows**: Fully supported (tested with Chrome/Edge)
- **Linux**: Supported in Chromium-based browsers

## Technical Details

### Built With

- **React**: UI framework
- **Vite**: Fast build tool and dev server
- **FFmpeg.wasm**: Browser-based video format conversion
- **MediaRecorder API**: Browser API for recording media streams
- **Canvas API**: For compositing screen and webcam streams

### How It Works

1. Captures screen using browser's `getDisplayMedia` API
2. Captures webcam and audio using `getUserMedia` API
3. Combines streams on an HTML5 Canvas element
4. Records canvas using MediaRecorder (WebM format)
5. Optionally converts WebM to MP4 using FFmpeg.wasm (runs entirely in browser)

## Troubleshooting

### Recording won't start
- **Browser Permissions**: When prompted, click "Allow" to grant screen recording and microphone permissions
- **macOS**: If needed, grant screen recording permissions in System Settings → Privacy & Security → Screen Recording
- **Browser Tab**: Make sure the recorder tab is open and active. Do not switch to another tab in the same window during recording.

### No webcam detected
- Check that your webcam is connected and not in use by another application
- Refresh the page to re-detect devices
- Try toggling webcam off if you only need screen recording

### Video quality is poor
- Use 4K quality setting if your screen resolution is high
- Ensure you have sufficient RAM (8GB+ for 4K)
- Close unnecessary applications to free up system resources
- Try recording in Chrome/Edge for best performance

### File size is too large
- Use 1080p instead of 4K
- Disable MP4 conversion if you only need WebM
- The MP4 conversion applies compression (CRF 23)

### MP4 conversion fails or is slow
- Ensure you have enough RAM (conversion happens in browser memory)
- Close other browser tabs to free up resources
- For long recordings, consider disabling MP4 conversion
- MP4 conversion uses FFmpeg.wasm which loads from CDN on first use

### Application won't start
- Verify Node.js is installed: `node -v` (should be v18+)
- Try deleting `node_modules` and running `npm install` again
- Check that port 5173 is not in use by another application

## Privacy & Security

- **100% Local**: All recording and processing happens in your browser
- **No Server Uploads**: Video files never leave your machine
- **No Tracking**: No analytics or telemetry
- **Open Source**: Full source code available for inspection
- **FFmpeg via CDN**: FFmpeg.wasm core files load from unpkg.com CDN (cached after first load)

## License

ISC License - feel free to use and modify as needed.

## Roadmap / Future Enhancements

- [ ] Keyboard shortcuts
- [ ] Drawing tools/annotations during recording
- [ ] System audio capture (not just microphone)
- [ ] Multiple monitor support
- [ ] Trimming/editing after recording
- [ ] GIF export option
- [ ] Custom watermarks
- [ ] Recording presets

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## Credits

Created as a local alternative to Loom for privacy-conscious users who want full control over their recordings.
