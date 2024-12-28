import React, { useState } from 'react';
import { HelpCircle, X, ZoomIn, Hand, Move } from 'lucide-react';

const GestureTutorial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

  const tutorials = {
    mobile: [
      { icon: <Hand size={20} />, text: "One finger drag - Rotate view" },
      { icon: <Move size={20} />, text: "Two fingers drag - Pan view" },
      { icon: <ZoomIn size={20} />, text: "Pinch - Zoom in/out" }
    ],
    desktop: [
      { icon: <Hand size={20} />, text: "Left click (or one finder click on touchpad) and drag - Rotate view" },
      { icon: <Move size={20} />, text: "Right click (or two finger click on touchpad) and drag - Pan view" },
      { icon: <ZoomIn size={20} />, text: "Mouse wheel (or two finger drag up/down on touchpad) - Zoom in/out" }
    ]
  };

  const currentTutorials = isMobile ? tutorials.mobile : tutorials.desktop;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center z-30"
        aria-label="View controls help"
      >
        <HelpCircle size={20} />
      </button>

      {/* Tutorial popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Content */}
          <div className="absolute bottom-20 left-4 right-4 md:left-auto md:right-20 md:bottom-4 md:w-80 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-light text-lg">View Controls</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {currentTutorials.map((tutorial, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    {tutorial.icon}
                  </div>
                  <span className='font-light'>{tutorial.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GestureTutorial;