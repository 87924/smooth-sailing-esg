import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet.heat";
import { MapIcon, Loader2, Filter } from "lucide-react";
import { Link } from "react-router-dom";

interface GeoJsonEntry {
  latitude: number;
  longitude: number;
  intensity?: number;
  type: string;
}

// Waste types
const wasteTypes = ["plastic_waste", "ocean_waste", "plastic_debris", "fishing_gear"];

// Load GeoJSON data dynamically
const loadGeoJsonFiles = async (selectedTypes: string[]): Promise<[number, number, number][]> => {
  const geojsonFiles = Array.from({ length: 843 }, (_, i) => `/geojson_files/file${i + 1}.geojson`);
  let allPoints: [number, number, number][] = [];

  for (const file of geojsonFiles) {
    try {
      const response = await fetch(file);
      if (!response.ok) continue;

      const textData = await response.text();
      if (textData.trim().startsWith("<!DOCTYPE html>")) continue;

      const data: GeoJsonEntry[] = JSON.parse(textData);
      if (!Array.isArray(data)) continue;

      // Filter based on selected waste types
      const filteredData = data.filter(({ latitude, longitude, type }) => {
        return (
          typeof latitude === "number" &&
          typeof longitude === "number" &&
          latitude >= -90 &&
          latitude <= 90 &&
          longitude >= -180 &&
          longitude <= 180 &&
          (selectedTypes.length === 0 || selectedTypes.includes(type))
        );
      });

      filteredData.forEach(({ latitude, longitude, intensity = 1 }) => {
        allPoints.push([latitude, longitude, intensity]);
      });

    } catch (error) {
      console.error(`Error loading ${file}:`, error);
    }
  }

  console.log(`✅ Loaded ${allPoints.length} points for types: ${selectedTypes.join(", ") || "All"}`);
  return allPoints;
};

// Heatmap Layer Component
// Heatmap Layer Component
const HeatmapLayer = ({ heatmapData }: { heatmapData: [number, number, number][] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || heatmapData.length === 0) return;

    const heatLayer = (L as any).heatLayer(heatmapData, {
      radius: 40,  // 🔹 Increased radius for better visibility
      blur: 30,    // 🔹 Soft blur to blend points smoothly
      maxZoom: 6,
      max: 1.0,    // 🔹 Ensures proper scaling of heatmap intensity
      gradient: {
        0.1: "#0000FF",  // 🔵 Deep Blue (Very Low)
        0.3: "#00FF00",  // 🟢 Green (Low)
        0.5: "#FFFF00",  // 🟡 Yellow (Medium)
        0.7: "#FFA500",  // 🟠 Orange (High)
        1.0: "#FF0000",  // 🔴 Red (Very High)
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, heatmapData]);

  return null;
};


// Main Map Component with Sidebar Filter
const Map = ({
  title = "Real-Time Waste Tracking",
  placeholder = "https://images.unsplash.com/photo-1577315734214-4b3dec92d9ad?q=80&w=1000",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<[number, number, number][]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const loadHeatmapData = async () => {
      setIsLoading(true);
      const data = await loadGeoJsonFiles(selectedTypes);
      setHeatmapData(data);
      setIsLoading(false);
    };
    loadHeatmapData();
  }, [selectedTypes]);

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
            <MapContainer center={[15.96, -87.62]} zoom={6} style={{ height: "100%", width: "100%" }}>
              {/* 🌍 Satellite Tile Layer */}
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              />
              <HeatmapLayer heatmapData={heatmapData} />
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Floating Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4 z-50 transition-transform duration-300 ${
          showFilter ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h3 className="text-lg font-bold mb-4">Filter by Waste Type</h3>
        {wasteTypes.map((type) => (
          <label key={type} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={selectedTypes.includes(type)}
              onChange={() => handleToggleType(type)}
            />
            <span className="text-gray-700">{type.replace("_", " ")}</span>
          </label>
        ))}
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md w-full hover:bg-blue-700"
          onClick={() => setShowFilter(false)}
        >
          Close
        </button>
      </div>

      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="fixed top-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
      >
        <Filter className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Map;
