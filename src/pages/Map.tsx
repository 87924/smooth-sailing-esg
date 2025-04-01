
import React, { useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, MapIcon, Info, Filter } from "lucide-react";
import { Link } from "react-router-dom";

// Custom components and hooks
import HeatmapLayer from "@/components/map/HeatmapLayer";
import FilterSidebar from "@/components/map/FilterSidebar";
import { useHeatmapData } from "@/hooks/useHeatmapData";
import InfoTooltip from "@/components/map/InfoTooltip";

// Waste types with improved labels and colors
const wasteTypes = [
  { id: "plastic_waste", label: "Plastic Waste", color: "#FF5C5C" },
  { id: "ocean_waste", label: "Ocean Waste", color: "#5C9DFF" },
  { id: "plastic_debris", label: "Plastic Debris", color: "#FFA75C" },
  { id: "fishing_gear", label: "Fishing Gear", color: "#5CFFC4" },
  { id: "industrial_waste", label: "Industrial Waste", color: "#C45CFF" },
  { id: "sewage_waste", label: "Sewage Waste", color: "#8B572A" }
];

// Main Map Component
const Map = ({
  title = "Real-Time Waste Tracking",
  placeholder = "https://images.unsplash.com/photo-1577315734214-4b3dec92d9ad?q=80&w=1000",
}) => {
  // State for filter management
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [clickedPoint, setClickedPoint] = useState<{
    lat: number;
    lng: number;
    type: string;
    intensity: number;
  } | null>(null);
  
  // Custom hook for heatmap data loading
  const { isLoading, heatmapData, rawData } = useHeatmapData(selectedTypes);

  // Handle waste type toggle
  const handleToggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Handle point click
  const handlePointClick = useCallback((point: { lat: number; lng: number; type: string; intensity: number }) => {
    setClickedPoint(point);
  }, []);

  // Close the info tooltip
  const closeTooltip = useCallback(() => {
    setClickedPoint(null);
  }, []);

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <button 
          onClick={() => setShowFilter(!showFilter)}
          className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle filter sidebar"
        >
          <Filter className="w-5 h-5 text-slate-700 dark:text-slate-200" />
        </button>
        
        <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-lg flex items-center">
          <MapIcon className="w-5 h-5 text-ocean mr-2" />
          <h1 className="text-lg font-bold">{title}</h1>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-30 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-ocean animate-spin mb-4" />
            <p className="text-lg font-medium">Loading waste data...</p>
          </div>
        </div>
      )}

      <div className="relative h-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 shadow-lg">
        <MapContainer 
          center={[15.975, -87.623]} 
          zoom={7} 
          style={{ height: "100%", width: "100%" }}
          preferCanvas={true}
          zoomControl={false}
          attributionControl={false}
        >
          {/* Ocean-themed Tile Layer */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          />
          
          {/* Enhanced Heatmap Layer */}
          {heatmapData.length > 0 && (
            <HeatmapLayer 
              heatmapData={heatmapData} 
              rawData={rawData}
              onPointClick={handlePointClick} 
            />
          )}

          {/* Map controls and attribution */}
          <div className="absolute bottom-4 right-4 z-10 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-2 text-xs text-slate-600 dark:text-slate-300">
            &copy; ESRI Ocean Base Map | Waste Data: Ocean Cleanup Project
          </div>
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg">
        <h3 className="text-sm font-semibold mb-2 flex items-center">
          <Info className="w-4 h-4 mr-1" />
          Waste Types Legend
        </h3>
        <div className="grid gap-1">
          {wasteTypes.map(type => (
            <div key={type.id} className="flex items-center text-xs">
              <span 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: type.color }}
              />
              {type.label}
            </div>
          ))}
        </div>
      </div>

      {/* Information Tooltip when a point is clicked */}
      {clickedPoint && (
        <InfoTooltip 
          point={clickedPoint} 
          onClose={closeTooltip}
        />
      )}

      {/* Filter Sidebar Component with enhanced styles */}
      <FilterSidebar 
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        selectedTypes={selectedTypes}
        handleToggleType={handleToggleType}
        wasteTypes={wasteTypes.map(w => w.id)}
        typeLabels={Object.fromEntries(wasteTypes.map(w => [w.id, w.label]))}
        typeColors={Object.fromEntries(wasteTypes.map(w => [w.id, w.color]))}
      />
    </div>
  );
};

export default Map;
