
import React from 'react';

interface MapLoadingProps {
  loading: boolean;
}

const MapLoading: React.FC<MapLoadingProps> = ({ loading }) => {
  if (!loading) return null;
  
  return (
    <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="glass-container p-6 rounded-xl max-w-md w-full mx-4 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-ocean border-t-transparent rounded-full animate-rotate mb-4"></div>
        <h3 className="text-xl font-semibold">Loading Map</h3>
        <p className="text-sm text-foreground/70 mt-2">
          Initializing waste detection heatmap...
        </p>
      </div>
    </div>
  );
};

export default MapLoading;
