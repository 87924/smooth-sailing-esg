
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!map || heatmapData.length === 0) return;

    // Debug log heatmap data
    console.log(`Creating heatmap with ${heatmapData.length} points`);
    console.log("Sample points:", heatmapData.slice(0, 3));

    // Add a brief delay for animation effect
    const timer = setTimeout(() => {
      setIsReady(true);
      
      // Create the heat layer with improved settings
      // @ts-ignore - leaflet.heat types are not properly recognized
      const heatLayer = L.heatLayer(heatmapData, {
        radius: 35,         // Increased radius for better visibility
        blur: 25,           // Soft blur to blend points smoothly
        maxZoom: 8,         // Max zoom level for full resolution
        max: 1.0,           // Ensures proper scaling of intensity
        gradient: {         // Custom color gradient
          0.1: "#0000FF",   // Blue (Very Low)
          0.3: "#00FF00",   // Green (Low)
          0.5: "#FFFF00",   // Yellow (Medium)
          0.7: "#FFA500",   // Orange (High)
          1.0: "#FF0000",   // Red (Very High)
        },
      }).addTo(map);

      // Show success toast
      if (heatmapData.length > 0) {
        toast({
          title: "Heatmap Updated",
          description: `Visualizing ${heatmapData.length} waste data points`,
        });
      }

      // Add pan/zoom event listener to update heatmap for better performance
      const handleMoveEnd = () => {
        if (heatLayer) {
          heatLayer.redraw();
        }
      };
      
      map.on('moveend', handleMoveEnd);

      // Cleanup when component unmounts or data changes
      return () => {
        map.removeLayer(heatLayer);
        map.off('moveend', handleMoveEnd);
        console.log("Removed heatmap layer");
      };
    }, 300);

    return () => clearTimeout(timer);
  }, [map, heatmapData]);

  return (
    <>
      {!isReady && heatmapData.length > 0 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card/80 backdrop-blur-sm p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-ocean border-t-transparent rounded-full" />
              <p className="text-sm font-medium">Loading heatmap data...</p>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default HeatmapLayer;
