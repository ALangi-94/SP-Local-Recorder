<<<<<<< HEAD
# LocalLoom - Local Screen Recorder

A simple, local alternative to Loom for recording screen demos, training videos, and walkthroughs. All recordings stay on your machine - no cloud uploads.

## Features

- **Screen Recording**
  - Record full screen or select specific area
  - Choose from multiple screens/windows
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

- **Output**
  - Saves as MP4 format
  - Automatic WebM to MP4 conversion using FFmpeg
  - Choose custom save location

## System Requirements

- macOS 10.13+ or Windows 10+
- Node.js 16+ (for development)
- 4GB RAM minimum
- For 4K recording: 8GB RAM recommended

## Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the Vite development server and launch the Electron application with hot-reload enabled.

### Production Mode

1. Build the application:
```bash
npm run build
```

2. Start the application:
```bash
npm start
```

### Package as Standalone App

To create a distributable application:

```bash
npm run package
```

This will create platform-specific installers in the `dist` folder.

## How to Use

1. **Launch the application**

2. **Configure your recording settings:**
   - **Screen Capture**: Choose between full screen or area selection. If full screen, select which screen/window to record.
   - **Webcam**: Toggle on/off, adjust position, size, and shape
   - **Audio**: Enable/disable and select microphone
   - **Quality**: Choose between 1080p or 4K
   - **Save Location**: Click "Browse" to select where to save the recording

3. **Start Recording:**
   - Click "Start Recording"
   - If you selected "Area Selection", you'll be prompted to choose the area
   - The preview window will show your recording in real-time

4. **Control Recording:**
   - **Pause/Resume**: Click to pause and resume
   - **Stop**: Click to stop and save the recording

5. **Save:**
   - The recording will be automatically converted from WebM to MP4
   - You'll get a notification when the save is complete

## Keyboard Shortcuts

Currently, all controls are via the UI. Keyboard shortcuts can be added in future versions.

## Platform Support

- **macOS**: Fully supported and tested
- **Windows**: Should work (Electron is cross-platform), but not extensively tested
- **Linux**: Should work with minor adjustments

## Technical Details

### Built With

- **Electron**: Cross-platform desktop application framework
- **React**: UI framework
- **Vite**: Fast build tool and dev server
- **FFmpeg**: Video encoding and format conversion
- **MediaRecorder API**: Browser API for recording media streams

### How It Works

1. Captures screen using Chromium's `desktopCapturer` API
2. Captures webcam and audio using `getUserMedia` API
3. Combines streams on an HTML5 Canvas
4. Records canvas using MediaRecorder (WebM format)
5. Converts WebM to MP4 using FFmpeg on save

## Troubleshooting

### Recording won't start
- **macOS**: Grant screen recording permissions in System Preferences → Security & Privacy → Privacy → Screen Recording
- **Microphone**: Grant microphone permissions if audio is enabled

### No webcam detected
- Check that your webcam is connected and not in use by another application
- Try toggling webcam off if you only need screen recording

### Video quality is poor
- Use 4K quality setting if your screen resolution is high
- Ensure you have sufficient RAM (8GB+ for 4K)
- Close unnecessary applications to free up system resources

### File size is too large
- Use 1080p instead of 4K for shorter videos
- The MP4 conversion already applies compression (CRF 22)

### FFmpeg conversion fails
- Ensure you have enough disk space
- Check that the save path is writable
- Try a different save location

## Privacy & Security

- **100% Local**: All recordings are processed and stored locally on your machine
- **No Cloud**: No data is sent to any server
- **No Tracking**: No analytics or telemetry
- **Open Source**: Full source code available for inspection

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
=======
# SP-Local-Recorder
Basic local recorder in web app for whole screen recording with webcam
>>>>>>> ef02144199eb5bd0ead8f2090b65efd251bb10f2
