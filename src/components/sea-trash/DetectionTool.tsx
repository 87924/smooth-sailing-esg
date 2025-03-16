
import React, { useState, useEffect } from 'react';
import { Info, RefreshCcw, MaximizeIcon, MinimizeIcon } from 'lucide-react';
import StreamlitEmbed from '../StreamlitEmbed';
import SeaTrashSection from './SeaTrashSection';

const DetectionTool = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Increment key to force iframe refresh
    setIframeKey(prevKey => prevKey + 1);
    // Reset after animation completes
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    // Handle escape key to exit fullscreen
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isFullscreen]);

  return (
    <div className="mb-12">
      <SeaTrashSection icon={Info} title="Sea Trash Detection Tool">
        <p className="text-muted-foreground mb-6">
          Our AI-powered tool helps identify various types of marine debris in images. 
          Upload your own images or use the sample images to see the detection in action.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-secondary/30 rounded-lg p-4 hover:bg-secondary/40 transition-colors">
            <div className="flex items-center mb-2">
              <span className="bg-ocean/10 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <span className="text-ocean font-medium">1</span>
              </span>
              <p className="font-medium">Wake up AI agent</p>
            </div>
            <p className="text-muted-foreground text-sm">The AI model might be sleeping. It may take some time to wake up and install dependencies on the first load.</p>
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-4 hover:bg-secondary/40 transition-colors">
            <div className="flex items-center mb-2">
              <span className="bg-ocean/10 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <span className="text-ocean font-medium">2</span>
              </span>
              <p className="font-medium">Upload an image</p>
            </div>
            <p className="text-muted-foreground text-sm">Click the "Browse files" button to upload your own image of ocean trash or marine debris.</p>
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-4 hover:bg-secondary/40 transition-colors">
            <div className="flex items-center mb-2">
              <span className="bg-ocean/10 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <span className="text-ocean font-medium">3</span>
              </span>
              <p className="font-medium">Try sample images</p>
            </div>
            <p className="text-muted-foreground text-sm">Use the sample images provided to quickly test the detection capabilities.</p>
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-4 hover:bg-secondary/40 transition-colors">
            <div className="flex items-center mb-2">
              <span className="bg-ocean/10 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <span className="text-ocean font-medium">4</span>
              </span>
              <p className="font-medium">View detection results</p>
            </div>
            <p className="text-muted-foreground text-sm">The AI will analyze the image and highlight detected trash with bounding boxes and confidence scores.</p>
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-4 hover:bg-secondary/40 transition-colors">
            <div className="flex items-center mb-2">
              <span className="bg-ocean/10 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <span className="text-ocean font-medium">5</span>
              </span>
              <p className="font-medium">Adjust confidence threshold</p>
            </div>
            <p className="text-muted-foreground text-sm">Use the slider to adjust the minimum confidence level for detections to be displayed.</p>
          </div>
        </div>
      </SeaTrashSection>
      
      <div 
        className={`relative border border-border rounded-xl overflow-hidden transition-all duration-300 
                   bg-background ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}
      >
        <div className="p-3 border-b border-border bg-card/80 backdrop-blur-md flex justify-between items-center">
          <h3 className="font-medium text-foreground">Sea Trash Detection Tool</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleRefresh}
              className="p-1.5 rounded-md hover:bg-secondary/50 transition-colors"
              title="Refresh app"
            >
              <RefreshCcw className={`w-4 h-4 text-ocean ${isRefreshing ? 'animate-rotate' : ''}`} />
            </button>
            <button 
              onClick={toggleFullscreen}
              className="p-1.5 rounded-md hover:bg-secondary/50 transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <MinimizeIcon className="w-4 h-4 text-ocean" />
              ) : (
                <MaximizeIcon className="w-4 h-4 text-ocean" />
              )}
            </button>
          </div>
        </div>
        
        <StreamlitEmbed 
          key={iframeKey}
          url="https://seadetection.streamlit.app/?embed=true&theme=dark" 
          title="Sea Trash Detection" 
          height={isFullscreen ? "calc(100vh - 48px)" : "800px"}
          customStyles=""
        />
      </div>
    </div>
  );
};

export default DetectionTool;
