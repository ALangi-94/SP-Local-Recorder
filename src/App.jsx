import React, { useState, useRef, useEffect } from 'react';

function App() {
  // Recording settings state
  const [webcamEnabled, setWebcamEnabled] = useState(true);
  const [webcamPosition, setWebcamPosition] = useState('bottom-right');
  const [webcamSize, setWebcamSize] = useState(20); // percentage
  const [webcamShape, setWebcamShape] = useState('circle');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioSource, setAudioSource] = useState('default');
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [quality, setQuality] = useState('1080p');
  const [savePath, setSavePath] = useState('');

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Refs
  const screenStreamRef = useRef(null);
  const webcamStreamRef = useRef(null);
  const audioStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const previewVideoRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Get available media devices
  useEffect(() => {
    getMediaDevices();
  }, []);

  const getMediaDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audio = devices.filter(device => device.kind === 'audioinput');
      const video = devices.filter(device => device.kind === 'videoinput');
      setAudioDevices(audio);
      setVideoDevices(video);
      if (audio.length > 0) setAudioSource(audio[0].deviceId);
    } catch (err) {
      console.error('Error getting media devices:', err);
    }
  };

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
      recordedChunksRef.current = [];

      // Get screen stream using getDisplayMedia (works cross-platform in Tauri)
      console.log('Requesting screen capture...');
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: quality === '4k' ? 3840 : 1920,
          height: quality === '4k' ? 2160 : 1080,
          frameRate: 30
        },
        audio: false
      });
      screenStreamRef.current = screenStream;

      // Get webcam stream if enabled
      let webcamStream = null;
      if (webcamEnabled && videoDevices.length > 0) {
        webcamStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: videoDevices[0].deviceId,
            width: 640,
            height: 480
          },
          audio: false
        });
        webcamStreamRef.current = webcamStream;
      }

      // Get audio stream if enabled
      let audioStream = null;
      if (audioEnabled) {
        audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: audioSource,
            echoCancellation: true,
            noiseSuppression: true
          },
          video: false
        });
        audioStreamRef.current = audioStream;
      }

      // Create canvas for combining streams
      const canvas = document.createElement('canvas');
      canvas.width = quality === '4k' ? 3840 : 1920;
      canvas.height = quality === '4k' ? 2160 : 1080;
      canvasRef.current = canvas;
      const ctx = canvas.getContext('2d');

      // Create video elements for streams
      const screenVideo = document.createElement('video');
      screenVideo.srcObject = screenStream;
      screenVideo.muted = true;
      await screenVideo.play();

      let webcamVideo = null;
      if (webcamStream) {
        webcamVideo = document.createElement('video');
        webcamVideo.srcObject = webcamStream;
        webcamVideo.muted = true;
        await webcamVideo.play();
      }

      // Wait for videos to be ready
      await new Promise(resolve => setTimeout(resolve, 500));

      // Draw combined video on canvas
      const drawFrame = () => {
        // Draw screen - check if video has valid dimensions
        if (screenVideo.videoWidth > 0 && screenVideo.videoHeight > 0) {
          ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
        }

        // Draw webcam if enabled
        if (webcamVideo && webcamEnabled) {
          const webcamWidth = (canvas.width * webcamSize) / 100;
          const webcamHeight = (webcamWidth * 3) / 4; // 4:3 aspect ratio

          // Calculate position
          let x, y;
          const padding = 20;
          switch (webcamPosition) {
            case 'top-left':
              x = padding;
              y = padding;
              break;
            case 'top-right':
              x = canvas.width - webcamWidth - padding;
              y = padding;
              break;
            case 'bottom-left':
              x = padding;
              y = canvas.height - webcamHeight - padding;
              break;
            case 'bottom-right':
            default:
              x = canvas.width - webcamWidth - padding;
              y = canvas.height - webcamHeight - padding;
              break;
          }

          // Apply shape
          ctx.save();
          if (webcamShape === 'circle') {
            ctx.beginPath();
            const radius = Math.min(webcamWidth, webcamHeight) / 2;
            ctx.arc(x + webcamWidth / 2, y + webcamHeight / 2, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
          } else if (webcamShape === 'rounded') {
            const radius = 15;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + webcamWidth - radius, y);
            ctx.quadraticCurveTo(x + webcamWidth, y, x + webcamWidth, y + radius);
            ctx.lineTo(x + webcamWidth, y + webcamHeight - radius);
            ctx.quadraticCurveTo(x + webcamWidth, y + webcamHeight, x + webcamWidth - radius, y + webcamHeight);
            ctx.lineTo(x + radius, y + webcamHeight);
            ctx.quadraticCurveTo(x, y + webcamHeight, x, y + webcamHeight - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.clip();
          }

          ctx.drawImage(webcamVideo, x, y, webcamWidth, webcamHeight);
          ctx.restore();
        }

        animationFrameRef.current = requestAnimationFrame(drawFrame);
      };

      // Start drawing
      drawFrame();

      // Get canvas stream
      const canvasStream = canvas.captureStream(30);

      // Combine canvas stream with audio
      let finalStream;
      if (audioStream) {
        finalStream = new MediaStream([
          ...canvasStream.getVideoTracks(),
          ...audioStream.getAudioTracks()
        ]);
      } else {
        finalStream = canvasStream;
      }

      // Create MediaRecorder with fallback mimeTypes
      let options;
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        options = {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: quality === '4k' ? 20000000 : 8000000
        };
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        options = {
          mimeType: 'video/webm;codecs=vp8',
          videoBitsPerSecond: quality === '4k' ? 20000000 : 8000000
        };
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        options = {
          mimeType: 'video/webm',
          videoBitsPerSecond: quality === '4k' ? 20000000 : 8000000
        };
      } else {
        options = {
          videoBitsPerSecond: quality === '4k' ? 20000000 : 8000000
        };
      }

      const mediaRecorder = new MediaRecorder(finalStream, options);
      mediaRecorderRef.current = mediaRecorder;

      console.log('Using mimeType:', options.mimeType || 'default');

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          console.log('Received data chunk:', event.data.size, 'bytes');
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        alert('Recording error: ' + event.error);
      };

      mediaRecorder.onstart = () => {
        console.log('MediaRecorder started');
      };

      mediaRecorder.onstop = async () => {
        console.log('MediaRecorder stopped, chunks:', recordedChunksRef.current.length);
        // Wait a bit to ensure all chunks are processed
        setTimeout(async () => {
          if (recordedChunksRef.current.length === 0) {
            console.error('No chunks recorded');
            alert('No recording data available. Please try again.');
            cleanup();
            return;
          }
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          console.log('Created blob:', blob.size, 'bytes');
          await saveRecording(blob);
          cleanup();
        }, 100);
      };

      mediaRecorder.start(100); // Capture in smaller chunks for better reliability
      console.log('MediaRecorder start() called, state:', mediaRecorder.state);
      setIsRecording(true);

      // Start timer
      setRecordingTime(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Show preview
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = finalStream;
        previewVideoRef.current.play();
      }

    } catch (err) {
      console.error('Error starting recording:', err);
      console.error('Error details:', err.name, err.message, err.stack);
      alert('Failed to start recording: ' + err.message + '\n\nPlease check the console for details.');
      cleanup();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        // Resume timer
        timerIntervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        // Pause timer
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      }
    }
  };

  const saveRecording = async (blob) => {
    try {
      // Create download link for browser
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = savePath || `recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      console.log('Recording saved successfully');
    } catch (err) {
      console.error('Error saving recording:', err);
      alert('Failed to save recording: ' + err.message);
    }
  };

  const cleanup = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach(track => track.stop());
      webcamStreamRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (previewVideoRef.current) {
      previewVideoRef.current.srcObject = null;
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectSavePath = async () => {
    // In browser mode, user will choose save location when downloading
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    setSavePath(`recording-${timestamp}.webm`);
  };

  return (
    <div className="app">
      <h1>SP Local Recorder</h1>

      {!isRecording ? (
        <>
          <div className="settings-section">
            <h2>Screen Capture</h2>
            <p style={{ color: '#666', fontSize: '14px', margin: '10px 0' }}>
              Click "Start Recording" and your system will prompt you to select which screen, window, or tab to record.
            </p>
          </div>

          <div className="settings-section">
            <h2>Webcam</h2>

            <div className="setting-row">
              <div className="checkbox-row">
                <input
                  type="checkbox"
                  id="webcam"
                  checked={webcamEnabled}
                  onChange={(e) => setWebcamEnabled(e.target.checked)}
                />
                <label htmlFor="webcam">Enable Webcam</label>
              </div>
            </div>

            {webcamEnabled && (
              <>
                <div className="setting-row">
                  <label>Position</label>
                  <select value={webcamPosition} onChange={(e) => setWebcamPosition(e.target.value)}>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>

                <div className="setting-row">
                  <label>Size</label>
                  <div className="slider-row">
                    <input
                      type="range"
                      min="10"
                      max="40"
                      value={webcamSize}
                      onChange={(e) => setWebcamSize(parseInt(e.target.value))}
                    />
                    <span>{webcamSize}%</span>
                  </div>
                </div>

                <div className="setting-row">
                  <label>Shape</label>
                  <div className="radio-group">
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="square"
                        value="square"
                        checked={webcamShape === 'square'}
                        onChange={(e) => setWebcamShape(e.target.value)}
                      />
                      <label htmlFor="square">Square</label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="rounded"
                        value="rounded"
                        checked={webcamShape === 'rounded'}
                        onChange={(e) => setWebcamShape(e.target.value)}
                      />
                      <label htmlFor="rounded">Rounded</label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="circle"
                        value="circle"
                        checked={webcamShape === 'circle'}
                        onChange={(e) => setWebcamShape(e.target.value)}
                      />
                      <label htmlFor="circle">Circle</label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="settings-section">
            <h2>Audio</h2>

            <div className="setting-row">
              <div className="checkbox-row">
                <input
                  type="checkbox"
                  id="audio"
                  checked={audioEnabled}
                  onChange={(e) => setAudioEnabled(e.target.checked)}
                />
                <label htmlFor="audio">Enable Audio</label>
              </div>
            </div>

            {audioEnabled && audioDevices.length > 0 && (
              <div className="setting-row">
                <label>Audio Source</label>
                <select value={audioSource} onChange={(e) => setAudioSource(e.target.value)}>
                  {audioDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="settings-section">
            <h2>Output</h2>

            <div className="setting-row">
              <label>Quality</label>
              <select value={quality} onChange={(e) => setQuality(e.target.value)}>
                <option value="1080p">1080p (Full HD)</option>
                <option value="4k">4K (Ultra HD)</option>
              </select>
            </div>

            <div className="setting-row">
              <label>Save Location</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={savePath}
                  onChange={(e) => setSavePath(e.target.value)}
                  placeholder="Choose save location..."
                  style={{ flex: 1 }}
                />
                <button onClick={selectSavePath} className="btn-secondary" style={{ flex: 'none', padding: '10px 20px' }}>
                  Browse
                </button>
              </div>
            </div>
          </div>

          <div className="button-group">
            <button onClick={startRecording} className="btn-primary">
              Start Recording
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="preview-container">
            <video ref={previewVideoRef} autoPlay muted />
            <div className="recording-indicator">
              <div className="recording-dot"></div>
              <span>{formatTime(recordingTime)}</span>
            </div>
          </div>

          <div className="status-message">
            {isPaused ? 'Recording Paused' : 'Recording in Progress...'}
          </div>

          <div className="button-group">
            <button onClick={pauseRecording} className="btn-secondary">
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={stopRecording} className="btn-danger">
              Stop Recording
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
