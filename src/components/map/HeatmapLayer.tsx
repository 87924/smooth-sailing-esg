
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import "leaflet.heat";

interface Point {
  lat: number;
  lng: number;
  type: string;
  intensity: number;
}

interface HeatmapLayerProps {
  heatmapData: [number, number, number][];
  rawData?: Point[];
  onPointClick?: (point: Point) => void;
}

const HeatmapLayer = ({ heatmapData, rawData = [], onPointClick }: HeatmapLayerProps) => {
  const map = useMap();
  const heatLayerRef = useRef<any>(null);
  const clickRadiusRef = useRef<L.CircleMarker | null>(null);

  useEffect(() => {
    if (!map || heatmapData.length === 0) return;

    // Debug log heatmap data
    console.log(`Creating heatmap with ${heatmapData.length} points`);
    
    // Remove existing heat layer if it exists
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    // Create the heat layer with improved settings
    // @ts-ignore - leaflet.heat types are not properly recognized
    heatLayerRef.current = L.heatLayer(heatmapData, {
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

    // Add click handler for the map when heatmap is present
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!rawData || !onPointClick) return;
      
      const { lat, lng } = e.latlng;
      
      // Find the closest point within a certain radius (in kilometers)
      const searchRadius = 10; // km
      const closestPoint = findClosestPoint(lat, lng, rawData, searchRadius);
      
      if (closestPoint) {
        // Show visual indicator of clicked area
        if (clickRadiusRef.current) {
          map.removeLayer(clickRadiusRef.current);
        }
        
        clickRadiusRef.current = L.circleMarker([closestPoint.lat, closestPoint.lng], {
          radius: 25,
          color: '#FFF',
          weight: 2,
          opacity: 1,
          fillColor: '#FFF',
          fillOpacity: 0.3,
          className: 'animate-pulse'
        }).addTo(map);
        
        // Call the click handler with the found point
        onPointClick(closestPoint);
      }
    };
    
    map.on('click', handleMapClick);

    // Cleanup when component unmounts or data changes
    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
      
      if (clickRadiusRef.current) {
        map.removeLayer(clickRadiusRef.current);
      }
      
      map.off('click', handleMapClick);
      console.log("Removed heatmap layer");
    };
  }, [map, heatmapData, rawData, onPointClick]);

  // Function to find the closest point within radius
  const findClosestPoint = (lat: number, lng: number, points: Point[], radiusKm: number): Point | null => {
    const earthRadiusKm = 6371; // Earth's radius in kilometers
    let closestPoint: Point | null = null;
    let closestDistance = Infinity;
    
    for (const point of points) {
      // Simple Haversine distance calculation
      const dLat = ((point.lat - lat) * Math.PI) / 180;
      const dLng = ((point.lng - lng) * Math.PI) / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos((lat * Math.PI) / 180) * Math.cos((point.lat * Math.PI) / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = earthRadiusKm * c;
      
      if (distance < radiusKm && distance < closestDistance) {
        closestDistance = distance;
        closestPoint = point;
      }
    }
    
    return closestPoint;
  };

  return null;
};

export default HeatmapLayer;
