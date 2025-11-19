import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCcw } from 'lucide-react';
import { Button } from './Button';

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions or try a different browser.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Flip horizontally for mirror effect
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
        stopCamera();
      }
    }
  };

  // Effect to attach stream to video element when stream becomes available
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.error("Autoplay prevented", e));
    }
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  if (error) {
    return (
      <div className="p-8 bg-red-900/20 border border-red-800 rounded-2xl text-center">
        <p className="text-red-200 mb-4">{error}</p>
        <Button onClick={() => setError(null)}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/20 h-[480px]"> 
      {!stream ? (
        <div className="flex flex-col items-center justify-center h-full bg-gray-900">
          <Camera className="w-16 h-16 text-gray-600 mb-4" />
          <p className="text-gray-400 mb-6">Camera is off</p>
          <Button onClick={startCamera} icon={<Camera size={20} />}>
            Start Camera
          </Button>
        </div>
      ) : (
        <div className="relative h-full flex items-center justify-center bg-black">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover transform -scale-x-100" 
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center gap-4 bg-gradient-to-t from-black/80 to-transparent">
             <Button 
                onClick={capturePhoto} 
                className="rounded-full w-16 h-16 flex items-center justify-center p-0 border-4 border-white/20 bg-white/90 hover:bg-white text-purple-600 transition-transform hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                aria-label="Take Photo"
              >
                <div className="w-12 h-12 bg-transparent rounded-full border-2 border-purple-500"></div>
              </Button>
          </div>
          <button 
            onClick={stopCamera}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 backdrop-blur-md transition-colors"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};