
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
  
  // Try to load all available files (maximum number based on observed files)
  const totalFilesToTry = 843;
  let allPoints: [number, number, number][] = [];
  let loadedFiles = 0;
  
  try {
    // Batch loading strategy
    const batchSize = 50;
    const batches = Math.ceil(totalFilesToTry / batchSize);
    
    for (let batch = 0; batch < batches; batch++) {
      const start = batch * batchSize + 1;
      const end = Math.min(start + batchSize - 1, totalFilesToTry);
      
      // Create array of file paths for this batch
      const batchFiles = Array.from(
        { length: end - start + 1 }, 
        (_, i) => `/geojson_files/file${start + i}.geojson`
      );
      
      // Use Promise.all for parallel loading within batch
      const responses = await Promise.all(
        batchFiles.map(file => 
          fetch(file)
            .then(response => response.ok ? response.json() : [])
            .catch(() => [])
        )
      );
      
      // Process responses
      responses.forEach(data => {
        if (!Array.isArray(data)) return;
        loadedFiles++;
        
        // Filter by type if needed
        const filteredData = selectedTypes.length > 0
          ? data.filter(({ type }) => {
              if (!type) return false;
              
              // Handle multiple waste types in a single entry (comma-separated)
              if (type.includes(',')) {
                const entryTypes = type.split(',').map(t => t.trim());
                return entryTypes.some(t => selectedTypes.includes(t));
              }
              
              return selectedTypes.includes(type);
            })
          : data;
        
        // Add valid points to result
        filteredData.forEach(({ latitude, longitude, intensity = 1 }) => {
          if (
            typeof latitude === "number" &&
            typeof longitude === "number" &&
            !isNaN(latitude) && 
            !isNaN(longitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180
          ) {
            allPoints.push([latitude, longitude, intensity]);
          }
        });
      });
      
      // If we've found a good number of points, we can break early for faster loading
      if (allPoints.length > 5000 && batch >= 5) {
        console.log(`Breaking early after processing ${loadedFiles} files with ${allPoints.length} points`);
        break;
      }
    }
    
    console.log(`✅ Loaded ${allPoints.length} points from ${loadedFiles} files`);
    
    // Cache the data for future use
    dataCache.set(cacheKey, allPoints);
    
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
