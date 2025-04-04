
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
  const pointMarkersRef = useRef<L.Marker[]>([]);
  
  // Memoize the data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => {
    // If we have too many points, downsample to improve performance
    if (heatmapData.length > 10000) {
      const samplingRate = Math.ceil(heatmapData.length / 10000);
      console.log(`Downsampling ${heatmapData.length} points with rate 1/${samplingRate}`);
      return heatmapData.filter((_, i) => i % samplingRate === 0);
    }
    return heatmapData;
  }, [heatmapData]);

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
    
    // Clear existing markers
    pointMarkersRef.current.forEach(marker => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });
    pointMarkersRef.current = [];

    // Use requestAnimationFrame for smoother rendering
    requestAnimationFrame(() => {
      // Create the heat layer with enhanced settings
      try {
        // @ts-ignore - leaflet.heat types are not properly recognized
        heatLayerRef.current = L.heatLayer(memoizedData, {
          radius: 15,           // Reduced radius for better performance
          blur: 20,             // Reduced blur for better performance
          maxZoom: 10,          // Optimized maxZoom
          max: 1.0,             // Ensures proper scaling of intensity
          minOpacity: 0.3,      // Better visibility at low intensities
          gradient: {           // Enhanced color gradient for better visualization
            0.1: "#0000FF",     // Blue (Very Low)
            0.3: "#00FF00",     // Green (Low)
            0.5: "#FFFF00",     // Yellow (Medium)
            0.7: "#FFA500",     // Orange (High)
            1.0: "#FF0000",     // Red (Very High)
          },
        }).addTo(map);
        
        // Add click functionality by creating invisible markers for each point
        // Only add markers when zoomed in to a certain level to maintain performance
        const handleZoomEnd = () => {
          const currentZoom = map.getZoom();
          
          // Only show interactive points at higher zoom levels for better performance
          if (currentZoom >= 8) {
            // Clear existing markers
            pointMarkersRef.current.forEach(marker => {
              if (map.hasLayer(marker)) {
                map.removeLayer(marker);
              }
            });
            pointMarkersRef.current = [];
            
            // Create markers for each data point (or a subset if there are many)
            const pointsToShow = currentZoom >= 10 ? memoizedData : memoizedData.filter((_, i) => i % 5 === 0);
            
            pointsToShow.forEach(point => {
              const [lat, lng, intensity] = point;
              
              // Create an invisible marker
              const marker = L.marker([lat, lng], {
                opacity: 0, // Completely transparent
                interactive: true
              });
              
              // Determine waste type based on location if available
              let wasteType = "Unknown";
              let wasteSize = "Medium";
              
              // Set intensity text based on the value
              let intensityText = "Medium";
              if (intensity <= 0.3) intensityText = "Low";
              else if (intensity >= 0.7) intensityText = "High";
              
              // Determine probable waste type based on the coordinates
              // This is a simplification - in a real app you'd have this data from your source
              if (lng < -80) wasteType = "Plastic Waste";
              else if (lng > 100) wasteType = "Ocean Debris";
              else wasteType = "Local Litter";
              
              // Add popup with information
              marker.bindPopup(`
                <div class="p-2">
                  <h3 class="font-bold text-lg">Waste Details</h3>
                  <ul class="mt-2">
                    <li><strong>Type:</strong> ${wasteType}</li>
                    <li><strong>Intensity:</strong> ${intensityText}</li>
                    <li><strong>Coordinates:</strong> ${lat.toFixed(5)}, ${lng.toFixed(5)}</li>
                  </ul>
                </div>
              `, {
                className: 'rounded-md shadow-lg',
                maxWidth: 300
              });
              
              marker.addTo(map);
              pointMarkersRef.current.push(marker);
            });
          } else {
            // Remove all markers when zoomed out
            pointMarkersRef.current.forEach(marker => {
              if (map.hasLayer(marker)) {
                map.removeLayer(marker);
              }
            });
            pointMarkersRef.current = [];
          }
        };
        
        // Add pan/zoom event listeners
        map.on('moveend', handleZoomEnd);
        map.on('zoomend', handleZoomEnd);
        
        // Initial check for the zoom level
        handleZoomEnd();
        
        // Set ready to true after a short delay for animation effect
        setTimeout(() => {
          setIsReady(true);
          
          // Only show toast for significant data updates
          if (memoizedData.length > 200) {
            toast({
              title: "Heatmap Ready",
              description: `Visualizing ${memoizedData.length} waste data points. Zoom in to click points for details.`,
            });
          }
        }, 300);

        // Cleanup when component unmounts or data changes
        return () => {
          if (heatLayerRef.current && map) {
            map.removeLayer(heatLayerRef.current);
          }
          
          pointMarkersRef.current.forEach(marker => {
            if (map.hasLayer(marker)) {
              map.removeLayer(marker);
            }
          });
          
          map.off('moveend', handleZoomEnd);
          map.off('zoomend', handleZoomEnd);
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
