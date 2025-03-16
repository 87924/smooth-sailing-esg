
import React, { useState } from 'react';
import { Map as MapIcon, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MapPreviewProps {
  title?: string;
  placeholder?: string;
}

const MapPreview = ({ 
  title = "Real-Time Waste Tracking",
  placeholder = "https://images.unsplash.com/photo-1577315734214-4b3dec92d9ad?q=80&w=1000"
}: MapPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="animated-border rounded-xl overflow-hidden">
      <div className="relative aspect-video">
        {/* Placeholder image */}
        <img 
          src={placeholder}
          alt="Map preview" 
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.8) brightness(0.7)' }}
        />
        
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <MapIcon className="w-12 h-12 text-ocean mb-4 animate-pulse-subtle" />
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-foreground/70 max-w-md mb-6">
            View real-time locations of detected marine waste and pollution hotspots around the globe.
          </p>
          <Link 
            to="/map" 
            className="glass-button ripple"
          >
            View Full Map
          </Link>
        </div>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-4 right-4">
            <Loader2 className="w-5 h-5 text-foreground/50 animate-rotate" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPreview;
