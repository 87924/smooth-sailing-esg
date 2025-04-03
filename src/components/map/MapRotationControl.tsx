import React, { useState } from "react";
import { useMap } from "react-leaflet";
import { RotateCcw, RotateCw } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

const MapRotationControl = () => {
  const map = useMap();
  const [currentBearing, setCurrentBearing] = useState(0);
  
  const rotateCw = () => {
    if (!map) return;
    
    const newBearing = (currentBearing + 45) % 360;
    setCurrentBearing(newBearing);
    
    // For Leaflet, we need to use a CSS transform for rotation
    // since setBearing is not a native Leaflet method
    const mapContainer = map.getContainer();
    mapContainer.style.transform = `rotate(${newBearing}deg)`;
    
    // Also rotate all markers and controls in the opposite direction to keep them upright
    const markers = document.querySelectorAll('.leaflet-marker-icon, .leaflet-control');
    markers.forEach((marker) => {
      if (marker instanceof HTMLElement) {
        marker.style.transform = `rotate(-${newBearing}deg)`;
      }
    });
    
    toast({
      title: "Map rotated",
      description: `Bearing set to ${newBearing}°`,
    });
  };
  
  const rotateCcw = () => {
    if (!map) return;
    
    const newBearing = (currentBearing - 45 + 360) % 360;
    setCurrentBearing(newBearing);
    
    // Apply rotation to map container
    const mapContainer = map.getContainer();
    mapContainer.style.transform = `rotate(${newBearing}deg)`;
    
    // Rotate markers and controls in the opposite direction
    const markers = document.querySelectorAll('.leaflet-marker-icon, .leaflet-control');
    markers.forEach((marker) => {
      if (marker instanceof HTMLElement) {
        marker.style.transform = `rotate(-${newBearing}deg)`;
      }
    });
    
    toast({
      title: "Map rotated",
      description: `Bearing set to ${newBearing}°`,
    });
  };
  
  const resetRotation = () => {
    if (!map) return;
    
    setCurrentBearing(0);
    
    // Reset map container rotation
    const mapContainer = map.getContainer();
    mapContainer.style.transform = 'rotate(0deg)';
    
    // Reset all marker rotations
    const markers = document.querySelectorAll('.leaflet-marker-icon, .leaflet-control');
    markers.forEach((marker) => {
      if (marker instanceof HTMLElement) {
        marker.style.transform = 'rotate(0deg)';
      }
    });
    
    toast({
      title: "Map rotation reset",
      description: "Map orientation restored to default",
    });
  };
  
  return (
    <div className="absolute top-52 left-4 z-[2000] bg-card/80 backdrop-blur-md p-2 rounded-lg shadow-lg border border-white/10">
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-center mb-1">Rotation</div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={rotateCcw}
            className="p-1.5 rounded-full hover:bg-secondary/50"
            title="Rotate counterclockwise"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetRotation}
            className="p-1.5 rounded-full bg-ocean/20 text-ocean hover:bg-ocean/30"
            title="Reset rotation"
          >
            <span className="text-xs font-medium">{currentBearing}°</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={rotateCw}
            className="p-1.5 rounded-full hover:bg-secondary/50"
            title="Rotate clockwise"
          >
            <RotateCw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MapRotationControl;
