'use client';

import { useState } from 'react';

export default function Home() {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = () => {
    const docElement = document.documentElement;

    if (!isFullscreen) {
      if (docElement.requestFullscreen) {
        docElement.requestFullscreen();
      } else if (document.mozRequestFullScreen) {
        // Firefox
        document.mozRequestFullScreen();
      } else if (docElement.webkitRequestFullscreen) {
        // Chrome, Safari
        docElement.webkitRequestFullscreen();
      } else if (docElement.msRequestFullscreen) {
        // IE/Edge
        docElement.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Full-Screen Demo</h1>
      <button
        onClick={toggleFullscreen}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg transition duration-300 hover:bg-blue-700"
      >
        {isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
      </button>

      {/* 任意内容を全画面で表示したい場合、ここに表示する内容を書く */}
      <div className="mt-6 text-center">
        {isFullscreen && (
          <div className="text-lg font-semibold">
            This content is now in full screen mode!
          </div>
        )}
      </div>
    </div>
  );
}
