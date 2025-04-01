
import { toast } from "@/components/ui/use-toast";

export interface GeoJsonEntry {
  latitude: number;
  longitude: number;
  intensity?: number;
  type: string;
}

interface Point {
  lat: number;
  lng: number;
  type: string;
  intensity: number;
}

/**
 * Loads and filters GeoJSON data from files
 */
export const loadGeoJsonFiles = async (selectedTypes: string[]): Promise<{
  points: [number, number, number][];
  rawPoints: Point[];
}> => {
  const geojsonFiles = Array.from({ length: 843 }, (_, i) => `/geojson_files/file${i + 1}.geojson`);
  let allPoints: [number, number, number][] = [];
  let rawPoints: Point[] = [];
  let loadedCount = 0;

  try {
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
            !isNaN(latitude) && 
            !isNaN(longitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180 &&
            (selectedTypes.length === 0 || selectedTypes.includes(type))
          );
        });

        filteredData.forEach(({ latitude, longitude, intensity = 1, type }) => {
          allPoints.push([latitude, longitude, intensity]);
          rawPoints.push({
            lat: latitude,
            lng: longitude,
            intensity,
            type
          });
        });
        
        loadedCount++;
      } catch (error) {
        console.error(`Error loading ${file}:`, error);
      }
    }

    console.log(`✅ Loaded data from ${loadedCount} files, total ${allPoints.length} points for types: ${selectedTypes.join(", ") || "All"}`);
    return { points: allPoints, rawPoints };
  } catch (error) {
    console.error("Error loading GeoJSON files:", error);
    toast({
      variant: "destructive",
      title: "Error loading map data",
      description: "There was a problem loading the waste data. Please try again.",
    });
    return { points: [], rawPoints: [] };
  }
};
