
import { toast } from "@/components/ui/use-toast";

export interface GeoJsonEntry {
  latitude: number;
  longitude: number;
  intensity?: number;
  type: string;
}

// Memory cache for storing loaded data
const dataCache = new Map<string, [number, number, number][]>();

/**
 * Loads and filters GeoJSON data from files with performance optimizations
 */
export const loadGeoJsonFiles = async (selectedTypes: string[]): Promise<[number, number, number][]> => {
  // Create a cache key based on selected types
  const cacheKey = selectedTypes.sort().join('_') || 'all';
  
  // Check if we have cached data
  if (dataCache.has(cacheKey)) {
    console.log(`✅ Using cached data for ${cacheKey}`);
    return dataCache.get(cacheKey) || [];
  }
  
  // Initial files to load - load fewer initially for faster display
  const initialBatchSize = 200;
  const geojsonFiles = Array.from({ length: initialBatchSize }, (_, i) => `/geojson_files/file${i + 1}.geojson`);
  let allPoints: [number, number, number][] = [];

  try {
    // Use Promise.all for parallel loading
    const responses = await Promise.all(
      geojsonFiles.map(file => 
        fetch(file)
          .then(response => response.ok ? response.text() : '')
          .catch(() => '')
      )
    );
    
    // Process responses
    responses.forEach(textData => {
      if (!textData || textData.trim().startsWith("<!DOCTYPE html>")) return;
      
      try {
        const data: GeoJsonEntry[] = JSON.parse(textData);
        if (!Array.isArray(data)) return;
        
        // Filter based on selected waste types - optimized filtering
        const filteredData = data.filter(({ latitude, longitude, type }) => {
          const validCoordinates = 
            typeof latitude === "number" &&
            typeof longitude === "number" &&
            !isNaN(latitude) && 
            !isNaN(longitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180;
            
          return validCoordinates && (selectedTypes.length === 0 || selectedTypes.includes(type));
        });
        
        filteredData.forEach(({ latitude, longitude, intensity = 1 }) => {
          allPoints.push([latitude, longitude, intensity]);
        });
      } catch (error) {
        // Silent error handling for faster loading
      }
    });
    
    console.log(`✅ Loaded data from ${initialBatchSize} files, total ${allPoints.length} points for types: ${selectedTypes.join(", ") || "All"}`);
    
    // Cache the data for future use
    dataCache.set(cacheKey, allPoints);
    
    // Load the rest of the files in the background if needed
    if (initialBatchSize < 843) {
      setTimeout(() => {
        loadRemainingFiles(initialBatchSize, 843, selectedTypes, cacheKey);
      }, 2000);
    }
    
    return allPoints;
  } catch (error) {
    console.error("Error loading GeoJSON files:", error);
    toast({
      variant: "destructive",
      title: "Error loading map data",
      description: "There was a problem loading the waste data. Please try again.",
    });
    return [];
  }
};

/**
 * Load remaining files in the background to complete the dataset
 */
const loadRemainingFiles = async (start: number, end: number, selectedTypes: string[], cacheKey: string) => {
  const batchSize = 100;
  const currentBatchEnd = Math.min(start + batchSize, end);
  
  const geojsonFiles = Array.from(
    { length: currentBatchEnd - start }, 
    (_, i) => `/geojson_files/file${start + i + 1}.geojson`
  );
  
  let newPoints: [number, number, number][] = [];
  let existingPoints = dataCache.get(cacheKey) || [];
  
  try {
    // Use Promise.all for parallel loading
    const responses = await Promise.all(
      geojsonFiles.map(file => 
        fetch(file)
          .then(response => response.ok ? response.text() : '')
          .catch(() => '')
      )
    );
    
    // Process responses
    responses.forEach(textData => {
      if (!textData || textData.trim().startsWith("<!DOCTYPE html>")) return;
      
      try {
        const data: GeoJsonEntry[] = JSON.parse(textData);
        if (!Array.isArray(data)) return;
        
        // Filter based on selected waste types - optimized filtering
        const filteredData = data.filter(({ latitude, longitude, type }) => {
          const validCoordinates = 
            typeof latitude === "number" &&
            typeof longitude === "number" &&
            !isNaN(latitude) && 
            !isNaN(longitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180;
            
          return validCoordinates && (selectedTypes.length === 0 || selectedTypes.includes(type));
        });
        
        filteredData.forEach(({ latitude, longitude, intensity = 1 }) => {
          newPoints.push([latitude, longitude, intensity]);
        });
      } catch (error) {
        // Silent error handling for faster loading
      }
    });
    
    // Update cache with combined points
    if (newPoints.length > 0) {
      const combinedPoints = [...existingPoints, ...newPoints];
      dataCache.set(cacheKey, combinedPoints);
      
      console.log(`✅ Background loaded additional ${newPoints.length} points, total ${combinedPoints.length}`);
    }
    
    // Continue loading remaining files if needed
    if (currentBatchEnd < end) {
      setTimeout(() => {
        loadRemainingFiles(currentBatchEnd, end, selectedTypes, cacheKey);
      }, 2000);
    }
  } catch (error) {
    console.error("Error loading additional GeoJSON files:", error);
  }
};
