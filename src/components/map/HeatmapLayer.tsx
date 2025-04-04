
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
  const memoizedData = useMemo(() => heatmapData, [JSON.stringify(heatmapData)]);

  useEffect(() => {
    if (!map || memoizedData.length === 0) return;

    // Debug log heatmap data
    console.log(`Creating heatmap with ${memoizedData.length} points`);
    
    // Set ready to false for loading indicator
    setIsReady(false);
    
    // Clear existing heatmap layer if it exists
    if (heatLayerRef.current && map.hasLayer(heatLayerRef.current)) {
      map.removeLayer(heatLayerRef.current);
    }

    // Use requestAnimationFrame for smoother rendering
    requestAnimationFrame(() => {
      // Create the heat layer with enhanced settings
      try {
        // @ts-ignore - leaflet.heat types are not properly recognized
        heatLayerRef.current = L.heatLayer(memoizedData, {
          radius: 20,           // Slightly reduced radius for better performance with more points
          blur: 25,             // Increased blur for smoother visuals
          maxZoom: 12,          // Optimized maxZoom
          max: 1.0,             // Ensures proper scaling of intensity
          minOpacity: 0.4,      // Better visibility at low intensities
          gradient: {           // Enhanced color gradient for better visualization
            0.1: "#0000FF",     // Blue (Very Low)
            0.3: "#00FF00",     // Green (Low)
            0.5: "#FFFF00",     // Yellow (Medium)
            0.7: "#FFA500",     // Orange (High)
            1.0: "#FF0000",     // Red (Very High)
          },
        }).addTo(map);

        // Add click event to show tooltip with information about the clicked area
        map.on('click', (e) => {
          const latlng = e.latlng;
          
          // Find nearby points (crude approximation)
          const nearbyPoints = memoizedData.filter(point => {
            const distance = map.distance(
              [point[0], point[1]],
              [latlng.lat, latlng.lng]
            );
            return distance < 10000; // Within 10km
          });
          
          if (nearbyPoints.length > 0) {
            const avgIntensity = nearbyPoints.reduce((sum, point) => sum + point[2], 0) / nearbyPoints.length;
            const intensityLevel = avgIntensity >= 4 ? 'High' : avgIntensity >= 2 ? 'Medium' : 'Low';
            
            // Create a popup with information
            L.popup()
              .setLatLng(latlng)
              .setContent(`
                <div style="text-align: center;">
                  <strong>Waste Detection</strong><br>
                  Intensity: ${intensityLevel}<br>
                  Points in area: ${nearbyPoints.length}
                </div>
              `)
              .openOn(map);
          }
        });
        
        // Add pan/zoom event listener to update heatmap for better performance
        const handleMoveEnd = () => {
          if (heatLayerRef.current) {
            // Redraw only when map movement ends, not during movement
            heatLayerRef.current.redraw();
          }
        };
        
        map.on('moveend', handleMoveEnd);
        
        // Set ready to true after a short delay for animation effect
        setTimeout(() => {
          setIsReady(true);
          
          // Only show toast for significant data updates
          if (memoizedData.length > 200) {
            toast({
              title: "Heatmap Updated",
              description: `Visualizing ${memoizedData.length} waste data points globally`,
            });
          }
        }, 300);

        // Cleanup when component unmounts or data changes
        return () => {
          if (heatLayerRef.current && map) {
            map.removeLayer(heatLayerRef.current);
            map.off('moveend', handleMoveEnd);
            map.off('click');
          }
        };
      } catch (error) {
        console.error("Error creating heatmap:", error);
        setIsReady(true); // Set ready even if there's an error to prevent endless loading
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
            transition={{ duration: 0.3 }}
            className="bg-card/80 backdrop-blur-sm p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-ocean border-t-transparent rounded-full" />
              <p className="text-sm font-medium">Generating heatmap...</p>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default HeatmapLayer;
