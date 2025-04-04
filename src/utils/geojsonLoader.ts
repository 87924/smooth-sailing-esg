
import { toast } from "@/components/ui/use-toast";

export interface GeoJsonEntry {
  latitude: number;
  longitude: number;
  intensity?: number;
  type: string;
}

// Memory cache for storing loaded data
const dataCache = new Map<string, { data: [number, number, number][], timestamp: number }>();
const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes cache validity

/**
 * Loads and filters GeoJSON data from files with performance optimizations
 */
export const loadGeoJsonFiles = async (selectedTypes: string[]): Promise<[number, number, number][]> => {
  // Create a cache key based on selected types
  const cacheKey = selectedTypes.sort().join('_') || 'all';
  const now = Date.now();
  
  // Check if we have valid cached data
  if (dataCache.has(cacheKey)) {
    const cachedData = dataCache.get(cacheKey);
    if (cachedData && now - cachedData.timestamp < CACHE_TIMEOUT) {
      console.log(`✅ Using cached data for ${cacheKey}`);
      return cachedData.data;
    }
  }
  
  // Reduced initial batch size for faster loading
  const initialBatchSize = 100; // Reduced from 400 to load faster
  
  // Prioritize high-value files that contain the most relevant data
  const priorityFiles = [
    '/geojson_files/file760.geojson',
    '/geojson_files/file761.geojson',
    '/geojson_files/file762.geojson',
    '/geojson_files/file778.geojson',
    '/geojson_files/file779.geojson',
    '/geojson_files/file780.geojson',
    '/geojson_files/file802.geojson',
    '/geojson_files/file803.geojson',
    '/geojson_files/file804.geojson',
    '/geojson_files/file809.geojson',
    '/geojson_files/file810.geojson',
    '/geojson_files/file811.geojson',
    '/geojson_files/file831.geojson',
    '/geojson_files/file843.geojson',
    '/geojson_files/file19.geojson',
    '/geojson_files/file20.geojson',
    '/geojson_files/file24.geojson',
    '/geojson_files/file33.geojson'
  ];
  
  // Generate paths for initial batch of files
  const initialFiles = Array.from(
    { length: initialBatchSize }, 
    (_, i) => `/geojson_files/file${i + 1}.geojson`
  );
  
  // Combine priority files with initial batch, avoiding duplicates
  const geojsonFiles = [...new Set([...priorityFiles, ...initialFiles])];
  
  let allPoints: [number, number, number][] = [];

  try {
    // Use faster Promise.allSettled for parallel loading with error resilience
    const responses = await Promise.allSettled(
      geojsonFiles.map(file => 
        fetch(file, { cache: 'force-cache' }) // Use browser cache when available
          .then(response => response.ok ? response.text() : '')
          .catch(() => '')
      )
    );
    
    // Process responses
    responses.forEach(result => {
      if (result.status !== 'fulfilled' || !result.value || result.value.trim().startsWith("<!DOCTYPE html>")) return;
      
      try {
        const data: GeoJsonEntry[] = JSON.parse(result.value);
        if (!Array.isArray(data)) return;
        
        // Optimized filter for waste types
        data.forEach(({ latitude, longitude, intensity = 1, type }) => {
          // Quick validation
          if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) return;
          if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return;
          
          // If no types are selected, include all
          if (selectedTypes.length === 0) {
            allPoints.push([latitude, longitude, intensity]);
            return;
          }
          
          // Handle comma-separated types more efficiently
          if (type) {
            if (type.includes(',')) {
              const entryTypes = type.split(',').map(t => t.trim());
              if (entryTypes.some(t => selectedTypes.includes(t))) {
                allPoints.push([latitude, longitude, intensity]);
              }
            } else if (selectedTypes.includes(type)) {
              allPoints.push([latitude, longitude, intensity]);
            }
          }
        });
      } catch (error) {
        // Silent error handling for faster loading
      }
    });
    
    console.log(`✅ Loaded data from ${initialBatchSize} files, total ${allPoints.length} points`);
    
    // Cache the data with timestamp
    dataCache.set(cacheKey, { data: allPoints, timestamp: now });
    
    // Load the rest of the files in the background after map is visible
    if (initialBatchSize < 300) { // Reduced from 843 to 300
      setTimeout(() => {
        loadRemainingFiles(initialBatchSize, 300, selectedTypes, cacheKey);
      }, 5000); // Increased delay to prioritize initial rendering
    }
    
    return allPoints;
  } catch (error) {
    console.error("Error loading GeoJSON files:", error);
    toast({
      variant: "destructive",
      title: "Error loading map data",
      description: "Please refresh the page and try again.",
    });
    return [];
  }
};

/**
 * Load remaining files in the background to complete the dataset
 */
const loadRemainingFiles = async (start: number, end: number, selectedTypes: string[], cacheKey: string) => {
  // Smaller batch size for background loading
  const batchSize = 50; // Reduced from 100
  const currentBatchEnd = Math.min(start + batchSize, end);
  
  const geojsonFiles = Array.from(
    { length: currentBatchEnd - start }, 
    (_, i) => `/geojson_files/file${start + i + 1}.geojson`
  );
  
  let newPoints: [number, number, number][] = [];
  const cachedData = dataCache.get(cacheKey);
  let existingPoints = cachedData?.data || [];
  
  try {
    // Use Promise.allSettled for resilience
    const responses = await Promise.allSettled(
      geojsonFiles.map(file => 
        fetch(file, { cache: 'force-cache' })
          .then(response => response.ok ? response.text() : '')
          .catch(() => '')
      )
    );
    
    // Process responses
    responses.forEach(result => {
      if (result.status !== 'fulfilled' || !result.value || result.value.trim().startsWith("<!DOCTYPE html>")) return;
      
      try {
        const data: GeoJsonEntry[] = JSON.parse(result.value);
        if (!Array.isArray(data)) return;
        
        // Process data efficiently
        data.forEach(({ latitude, longitude, intensity = 1, type }) => {
          // Quick validation
          if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) return;
          if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return;
          
          // If no types are selected, include all
          if (selectedTypes.length === 0) {
            newPoints.push([latitude, longitude, intensity]);
            return;
          }
          
          // Handle comma-separated types more efficiently
          if (type) {
            if (type.includes(',')) {
              const entryTypes = type.split(',').map(t => t.trim());
              if (entryTypes.some(t => selectedTypes.includes(t))) {
                newPoints.push([latitude, longitude, intensity]);
              }
            } else if (selectedTypes.includes(type)) {
              newPoints.push([latitude, longitude, intensity]);
            }
          }
        });
      } catch (error) {
        // Silent error handling
      }
    });
    
    // Update cache with combined points
    if (newPoints.length > 0) {
      const combinedPoints = [...existingPoints, ...newPoints];
      dataCache.set(cacheKey, { data: combinedPoints, timestamp: Date.now() });
      
      console.log(`✅ Background loaded additional ${newPoints.length} points, total ${combinedPoints.length}`);
    }
    
    // Continue loading remaining files if needed
    if (currentBatchEnd < end) {
      setTimeout(() => {
        loadRemainingFiles(currentBatchEnd, end, selectedTypes, cacheKey);
      }, 8000); // Increased delay between batches to reduce resource contention
    }
  } catch (error) {
    console.error("Error loading additional GeoJSON files:", error);
  }
};

