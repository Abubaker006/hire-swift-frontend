"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface VideoPopupProps {
  onClose: () => void;
}

const VideoPopup: React.FC<VideoPopupProps> = ({ onClose }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const videoElement = videoRef.current;

    if (videoElement) {
      const handleLoadedData = () => {
        setIsLoaded(true);
        videoElement.play();
      };

      videoElement.onloadeddata = handleLoadedData;
    }

    return () => {
      document.body.style.overflow = "";

      if (videoElement) {
        videoElement.onloadeddata = null;
      }
    };
  }, []);

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full max-w-4xl mx-4">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 text-white hover:text-purple-300 p-2 z-10"
        >
          <X size={24} />
        </button>

        <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            className={`w-full ${
              isLoaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
            controls
            preload="auto"
            controlsList="nodownload"
          >
            <source src="/assets/videos/video-instance.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;
