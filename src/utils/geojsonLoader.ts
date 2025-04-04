
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
  
  // Load more files initially for a more comprehensive dataset
  const initialBatchSize = 400; // Increased from 200 to load more data points
  const geojsonFiles = Array.from({ length: initialBatchSize }, (_, i) => `/geojson_files/file${i + 1}.geojson`);
  
  // Add specific high-value files that have important data
  const additionalImportantFiles = [
    '/geojson_files/file760.geojson', 
    '/geojson_files/file761.geojson',
    '/geojson_files/file762.geojson',
    '/geojson_files/file763.geojson',
    '/geojson_files/file764.geojson',
    '/geojson_files/file765.geojson',
    '/geojson_files/file766.geojson',
    '/geojson_files/file767.geojson',
    '/geojson_files/file768.geojson',
    '/geojson_files/file769.geojson',
    '/geojson_files/file770.geojson',
    '/geojson_files/file771.geojson',
    '/geojson_files/file772.geojson',
    '/geojson_files/file773.geojson',
    '/geojson_files/file774.geojson',
    '/geojson_files/file775.geojson',
    '/geojson_files/file776.geojson',
    '/geojson_files/file777.geojson',
    '/geojson_files/file778.geojson',
    '/geojson_files/file779.geojson',
    '/geojson_files/file780.geojson',
    '/geojson_files/file781.geojson',
    '/geojson_files/file782.geojson',
    '/geojson_files/file783.geojson',
    '/geojson_files/file801.geojson',
    '/geojson_files/file802.geojson',
    '/geojson_files/file803.geojson',
    '/geojson_files/file804.geojson',
    '/geojson_files/file805.geojson',
    '/geojson_files/file806.geojson',
    '/geojson_files/file807.geojson',
    '/geojson_files/file808.geojson',
    '/geojson_files/file809.geojson',
    '/geojson_files/file810.geojson',
    '/geojson_files/file811.geojson',
    '/geojson_files/file812.geojson',
    '/geojson_files/file813.geojson',
    '/geojson_files/file814.geojson',
    '/geojson_files/file815.geojson',
    '/geojson_files/file816.geojson',
    '/geojson_files/file817.geojson',
    '/geojson_files/file819.geojson',
    '/geojson_files/file820.geojson'
  ];
  
  // Add the additional files to our list, avoiding duplicates
  additionalImportantFiles.forEach(file => {
    if (!geojsonFiles.includes(file)) {
      geojsonFiles.push(file);
    }
  });
  
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
        
        // Improved filter for waste types - handle comma-separated types
        const filteredData = data.filter(({ latitude, longitude, type }) => {
          // Ensure coordinates are valid
          const validCoordinates = 
            typeof latitude === "number" &&
            typeof longitude === "number" &&
            !isNaN(latitude) && 
            !isNaN(longitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180;
            
          if (!validCoordinates) return false;
          
          // If no types are selected, include all
          if (selectedTypes.length === 0) return true;
          
          // Handle multiple waste types in a single entry (comma-separated)
          if (type && type.includes(',')) {
            const entryTypes = type.split(',').map(t => t.trim());
            return entryTypes.some(t => selectedTypes.includes(t));
          }
          
          // Standard single type check
          return selectedTypes.includes(type);
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
        
        // Improved filter for waste types - handle comma-separated types
        const filteredData = data.filter(({ latitude, longitude, type }) => {
          // Ensure coordinates are valid
          const validCoordinates = 
            typeof latitude === "number" &&
            typeof longitude === "number" &&
            !isNaN(latitude) && 
            !isNaN(longitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180;
            
          if (!validCoordinates) return false;
          
          // If no types are selected, include all
          if (selectedTypes.length === 0) return true;
          
          // Handle multiple waste types in a single entry (comma-separated)
          if (type && type.includes(',')) {
            const entryTypes = type.split(',').map(t => t.trim());
            return entryTypes.some(t => selectedTypes.includes(t));
          }
          
          // Standard single type check
          return selectedTypes.includes(type);
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
