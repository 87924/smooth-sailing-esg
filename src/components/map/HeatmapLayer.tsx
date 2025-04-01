
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import "leaflet.heat";

interface HeatmapLayerProps {
  heatmapData: [number, number, number][];
}

const HeatmapLayer = ({ heatmapData }: HeatmapLayerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || heatmapData.length === 0) return;

    // Debug log heatmap data
    console.log(`Creating heatmap with ${heatmapData.length} points`);
    console.log("Sample points:", heatmapData.slice(0, 3));

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

    // Cleanup when component unmounts or data changes
    return () => {
      map.removeLayer(heatLayer);
      console.log("Removed heatmap layer");
    };
  }, [map, heatmapData]);

  return null;
};

export default HeatmapLayer;
