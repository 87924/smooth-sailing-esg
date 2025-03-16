
import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { targetBoundary } from '../utils/mapData';
import { flyToCoordinates } from '../utils/mapUtils';
import MapControls from '../components/map/MapControls';
import MapFilters from '../components/map/MapFilters';
import MapLegend from '../components/map/MapLegend';
import MapInfoPanel from '../components/map/MapInfoPanel';
import MapStatsFooter from '../components/map/MapStatsFooter';
import MapLoading from '../components/map/MapLoading';
import { useMapSetup, useMapLayers } from '../hooks/useMapSetup';
import { useMapFilters } from '../hooks/useMapFilters';

const Map = () => {
  // Initialize map using custom hook
  const { mapContainer, map, markersRef, loading } = useMapSetup();
  
  // Initialize filters using custom hook
  const {
    selectedType,
    setSelectedType,
    selectedTimePeriod,
    setSelectedTimePeriod,
    selectedSeverity,
    isFilterOpen,
    setIsFilterOpen,
    heatmapVisible,
    wasteData,
    getFilteredData,
    toggleHeatmap,
    applyFilters,
    toggleSeverity
  } = useMapFilters(map);
  
  // Apply map layers and data filters using custom hook
  useMapLayers(
    map, 
    markersRef, 
    loading, 
    wasteData, 
    selectedType, 
    selectedTimePeriod, 
    selectedSeverity, 
    heatmapVisible
  );

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
