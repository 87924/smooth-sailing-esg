
import { useEffect, useState, useRef, useMemo } from "react";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import "leaflet.heat";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

interface HeatmapLayerProps {
  heatmapData: [number, number, number][];
}

const HeatmapLayer = ({ heatmapData }: HeatmapLayerProps) => {
  const map = useMap();
  const [isReady, setIsReady] = useState(false);
  const heatLayerRef = useRef<any>(null);
  
  // Memoize the data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => {
    // For large datasets, downsample to improve performance
    if (heatmapData.length > 2000) {
      return heatmapData.filter((_, index) => index % 2 === 0); // Take every other point
    }
    return heatmapData;
  }, [heatmapData]);

  useEffect(() => {
    if (!map || memoizedData.length === 0) return;
    
    // Set ready to false for loading indicator
    setIsReady(false);
    
    // Clear existing heatmap layer if it exists
    if (heatLayerRef.current && map.hasLayer(heatLayerRef.current)) {
      map.removeLayer(heatLayerRef.current);
    }

    // Use requestAnimationFrame for smoother rendering
    requestAnimationFrame(() => {
      try {
        // Optimized heat layer settings for better performance
        // @ts-ignore - leaflet.heat types are not properly recognized
        heatLayerRef.current = L.heatLayer(memoizedData, {
          radius: 15,         // Further reduced radius for better performance
          blur: 20,           // Reduced blur
          maxZoom: 10,        // Lower maxZoom to improve performance at high zoom levels
          max: 1.0,
          minOpacity: 0.4,
          gradient: {
            0.1: "#0000FF",   // Blue (Very Low)
            0.3: "#00FF00",   // Green (Low)
            0.5: "#FFFF00",   // Yellow (Medium)
            0.7: "#FFA500",   // Orange (High)
            1.0: "#FF0000",   // Red (Very High)
          },
        }).addTo(map);

        // Optimize event handling - only redraw on moveend
        const handleMoveEnd = () => {
          if (heatLayerRef.current) {
            heatLayerRef.current.redraw();
          }
        };
        
        map.on('moveend', handleMoveEnd);
        
        // Set ready after a very short delay
        setTimeout(() => {
          setIsReady(true);
        }, 100); // Reduced from 300ms

        // Cleanup when component unmounts or data changes
        return () => {
          if (heatLayerRef.current && map) {
            map.removeLayer(heatLayerRef.current);
            map.off('moveend', handleMoveEnd);
          }
        };
      } catch (error) {
        console.error("Error creating heatmap:", error);
        setIsReady(true);
        toast({
          title: "Heatmap Error",
          description: "There was a problem creating the heatmap",
          variant: "destructive"
        });
      }
    });
  }, [map, memoizedData]);

  return (
    <>
      {!isReady && memoizedData.length > 0 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-card/80 backdrop-blur-sm p-3 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-ocean border-t-transparent rounded-full" />
              <p className="text-xs font-medium">Loading map...</p>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default HeatmapLayer;
