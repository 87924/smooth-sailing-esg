
import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, MapIcon } from "lucide-react";
import { Link } from "react-router-dom";

// Custom components and hooks
import HeatmapLayer from "@/components/map/HeatmapLayer";
import FilterSidebar from "@/components/map/FilterSidebar";
import { useHeatmapData } from "@/hooks/useHeatmapData";

// Waste types
const wasteTypes = [
  "plastic_waste", 
  "ocean_waste", 
  "plastic_debris", 
  "fishing_gear",
  "industrial_waste",
  "sewage_waste"
];

// Main Map Component
const Map = ({
  title = "Real-Time Waste Tracking",
  placeholder = "https://images.unsplash.com/photo-1577315734214-4b3dec92d9ad?q=80&w=1000",
}) => {
  // State for filter management
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  
  // Custom hook for heatmap data loading
  const { isLoading, heatmapData } = useHeatmapData(selectedTypes);

  // Handle waste type toggle
  const handleToggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="relative">
      <div className="animated-border rounded-xl overflow-hidden">
        <div className="relative aspect-video">
          <img
            src={placeholder}
            alt="Map preview"
            className="w-full h-full object-cover"
            style={{ filter: "saturate(0.8) brightness(0.7)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-600 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <MapIcon className="w-12 h-12 text-ocean mb-4 animate-pulse-subtle" />
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-foreground/70 max-w-md mb-6">
              View real-time locations of detected marine waste and pollution hotspots.
            </p>
            <Link to="/map" className="glass-button ripple text-lg font-semibold">
              View Full Map
            </Link>
          </div>

          {isLoading && (
            <div className="absolute top-4 right-4">
              <Loader2 className="w-5 h-5 text-foreground/50 animate-rotate" />
            </div>
          )}

          <div className="absolute inset-0 z-10">
            <MapContainer 
              center={[15.96, -87.62]} 
              zoom={3} 
              style={{ height: "100%", width: "100%" }}
              preferCanvas={true} // Improve performance for large datasets
            >
              {/* Satellite Tile Layer */}
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                maxZoom={19}
              />
              
              {/* Heatmap Layer - this is the important part for showing the heatmap */}
              {heatmapData.length > 0 && (
                <HeatmapLayer heatmapData={heatmapData} />
              )}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Filter Sidebar Component */}
      <FilterSidebar 
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        selectedTypes={selectedTypes}
        handleToggleType={handleToggleType}
        wasteTypes={wasteTypes}
      />
    </div>
  );
};

export default Map;
