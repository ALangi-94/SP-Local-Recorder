# Quick Start Guide

## Getting Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the App
```bash
npm run dev
```

The application window will open automatically.

### 3. Start Recording

1. **Choose your screen**: Select which screen/window to record from the thumbnails
2. **Configure webcam** (optional): Toggle on, choose position, size, and shape
3. **Enable audio** (optional): Toggle on and select your microphone
4. **Choose quality**: Select 1080p or 4K
5. **Set save location**: Click "Browse" to choose where to save
6. **Click "Start Recording"**

## First Time Setup (macOS)

When you first start recording, macOS will ask for permissions:

1. **Screen Recording**: System Preferences → Security & Privacy → Privacy → Screen Recording
   - Enable for "Electron" or "LocalLoom"

2. **Microphone** (if using audio): System Preferences → Security & Privacy → Privacy → Microphone
   - Enable for "Electron" or "LocalLoom"

3. **Camera** (if using webcam): System Preferences → Security & Privacy → Privacy → Camera
   - Enable for "Electron" or "LocalLoom"

You'll need to restart the app after granting permissions.

## Tips

- **Test first**: Do a short test recording to ensure everything works
- **Disk space**: 4K recordings use ~500MB per minute
- **Performance**: Close unnecessary apps for smooth 4K recording
- **Preview**: The preview shows what will be recorded in real-time

## Troubleshooting

**App won't start?**
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` and run `npm install` again

**Can't see my screen?**
- Grant screen recording permissions (see above)
- Restart the app after granting permissions

**Recording is laggy?**
- Try 1080p instead of 4K
- Close other applications
- Check CPU usage in Activity Monitor

**No audio?**
- Grant microphone permissions
- Select the correct microphone in settings
- Test your mic in System Preferences

## Need More Help?

See the full [README.md](README.md) for detailed documentation.
