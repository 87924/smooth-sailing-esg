
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from "@/components/ui/use-toast";
import { initialWasteData, targetBoundary, filterWasteData } from '../utils/mapData';
import { addTargetBoundary, addHeatmapLayer, renderMarkers, flyToCoordinates } from '../utils/mapUtils';
import MapControls from '../components/map/MapControls';
import MapFilters from '../components/map/MapFilters';
import MapLegend from '../components/map/MapLegend';
import MapInfoPanel from '../components/map/MapInfoPanel';
import MapStatsFooter from '../components/map/MapStatsFooter';
import MapLoading from '../components/map/MapLoading';

const Map = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [heatmapVisible, setHeatmapVisible] = useState(true);
  const rotationRequestId = useRef<number | null>(null);

  // State for filters
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("24h");
  const [selectedSeverity, setSelectedSeverity] = useState<string[]>(["low", "medium", "high"]);
  
  // State for waste data
  const [wasteData, setWasteData] = useState(initialWasteData);

  // Get filtered data based on user selections
  const getFilteredData = () => {
    return filterWasteData(wasteData, selectedType, selectedTimePeriod, selectedSeverity);
  };

  // Setup map with the token provided
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Set the Mapbox token (using the provided token)
    mapboxgl.accessToken = "pk.eyJ1IjoiaWJyYWhpbWFsaTA3ODYiLCJhIjoiY20yYWRiZWw0MGQxZDJvczd6bzc4aDUzMiJ9.FUTLwMNaICKfoct8yJqVQQ";
    
    try {
      // Initialize map with improved stability settings and focused on specified coordinates
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        zoom: 14, // Higher zoom to focus on target area
        center: [-87.6225, 15.9752], // Center between the coordinates
        pitch: 45,
        minZoom: 0.5,
        maxZoom: 18,
        renderWorldCopies: true,
        attributionControl: false,
        preserveDrawingBuffer: true,
        antialias: true,
        trackResize: true,
        fadeDuration: 0
      });

      // Add navigation controls
      const nav = new mapboxgl.NavigationControl({
        visualizePitch: true,
        showCompass: true,
      });
      map.current.addControl(nav, 'top-right');
      
      // Add attribution control in a subtle position
      map.current.addControl(new mapboxgl.AttributionControl(), 'bottom-left');

      // Add scale
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

      // Set up map load event with improved error handling
      map.current.on('load', () => {
        try {
          if (!map.current) return;

          // Add atmosphere and fog effects for visual appeal
          map.current.setFog({
            color: 'rgb(186, 210, 235)',
            'high-color': 'rgb(36, 92, 223)',
            'horizon-blend': 0.02,
            'space-color': 'rgb(11, 11, 25)',
            'star-intensity': 0.6
          });

          // Add target area boundary
          addTargetBoundary(map.current);

          // Add heatmap source
          addHeatmapLayer(map.current, wasteData, selectedType, selectedTimePeriod, selectedSeverity, heatmapVisible);
          
          // Add points source for individual markers
          markersRef.current = renderMarkers(
            map.current, 
            markersRef.current, 
            wasteData, 
            selectedType, 
            selectedTimePeriod, 
            selectedSeverity
          );
          
          setLoading(false);
          
          // Notify user that the map has loaded
          toast({
            title: "Map loaded successfully",
            description: "Waste detection heatmap is now active in the specified coordinates",
          });
        } catch (err) {
          console.error('Error during map load:', err);
          setLoading(false);
          toast({
            variant: "destructive",
            title: "Map error",
            description: "Failed to initialize map components",
          });
        }
      });

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        toast({
          variant: "destructive",
          title: "Map error occurred",
          description: "The map encountered an error. Please refresh the page.",
        });
      });

      return () => {
        if (rotationRequestId.current) {
          cancelAnimationFrame(rotationRequestId.current);
          rotationRequestId.current = null;
        }
        
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Map initialization failed",
        description: "There was an error loading the map",
      });
    }
  }, []);

  // Update map when filters change
  useEffect(() => {
    if (!map.current || loading || !map.current.loaded()) return;
    
    // Update heatmap and markers with filtered data
    addTargetBoundary(map.current);
    addHeatmapLayer(map.current, wasteData, selectedType, selectedTimePeriod, selectedSeverity, heatmapVisible);
    markersRef.current = renderMarkers(
      map.current, 
      markersRef.current, 
      wasteData, 
      selectedType, 
      selectedTimePeriod, 
      selectedSeverity
    );
    
  }, [selectedType, selectedTimePeriod, selectedSeverity, heatmapVisible, loading]);

  // Toggle heatmap visibility
  const toggleHeatmap = () => {
    if (!map.current) return;
    
    setHeatmapVisible(!heatmapVisible);
  };

  // Apply all filters
  const applyFilters = () => {
    if (!map.current) return;
    
    // Re-render markers and update heatmap
    markersRef.current = renderMarkers(
      map.current, 
      markersRef.current, 
      wasteData, 
      selectedType, 
      selectedTimePeriod, 
      selectedSeverity
    );
    addHeatmapLayer(map.current, wasteData, selectedType, selectedTimePeriod, selectedSeverity, heatmapVisible);
    
    // Close filter panel
    setIsFilterOpen(false);
    
    // Notify user
    toast({
      title: "Filters Applied",
      description: "Map view has been updated based on your filters",
    });
  };

  // Toggle severity filter
  const toggleSeverity = (severity: string) => {
    if (selectedSeverity.includes(severity)) {
      // Remove severity if it's already selected (but don't allow empty array)
      if (selectedSeverity.length > 1) {
        setSelectedSeverity(prev => prev.filter(s => s !== severity));
      }
    } else {
      // Add severity if not already selected
      setSelectedSeverity(prev => [...prev, severity]);
    }
  };

  // Handler for fly to coordinates
  const handleFlyToCoordinates = () => {
    if (!map.current) return;
    flyToCoordinates(map.current, targetBoundary);
  };

  return (
    <div className="pt-16 min-h-screen flex flex-col">
      <div className="flex-1 relative">
        {/* Loading Overlay */}
        <MapLoading loading={loading} />

        <div className="absolute inset-0 bg-ocean-waves opacity-[0.02] animate-wave pointer-events-none"></div>
        
        {/* Map container */}
        <div ref={mapContainer} className="absolute inset-0" style={{ backgroundColor: "#111927" }}></div>
        
        {/* Map Controls */}
        <MapControls
          heatmapVisible={heatmapVisible}
          toggleHeatmap={toggleHeatmap}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          flyToCoordinates={handleFlyToCoordinates}
        />
        
        {/* Filters Panel */}
        <MapFilters
          isFilterOpen={isFilterOpen}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedTimePeriod={selectedTimePeriod}
          setSelectedTimePeriod={setSelectedTimePeriod}
          selectedSeverity={selectedSeverity}
          toggleSeverity={toggleSeverity}
          applyFilters={applyFilters}
        />
        
        {/* Legend */}
        <MapLegend />
        
        {/* Info Panel */}
        <MapInfoPanel />
      </div>
      
      {/* Stats Footer */}
      <MapStatsFooter 
        filteredData={getFilteredData()}
        selectedType={selectedType}
        selectedSeverity={selectedSeverity}
      />
    </div>
  );
};

export default Map;
