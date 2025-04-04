
import { useState, useEffect, useRef } from "react";
import { loadGeoJsonFiles } from "@/utils/geojsonLoader";
import { toast } from "@/components/ui/use-toast";

export const useHeatmapData = (selectedTypes: string[]) => {
  const [isLoading, setIsLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<[number, number, number][]>([]);
  const loadingRef = useRef(false);
  const previousTypesRef = useRef<string[]>([]);
  
  useEffect(() => {
    // Skip if already loading
    if (loadingRef.current) return;
    
    // Skip if the selectedTypes array is the same as before
    const typesString = selectedTypes.sort().join(',');
    const prevTypesString = previousTypesRef.current.sort().join(',');
    if (typesString === prevTypesString && heatmapData.length > 0) return;
    
    previousTypesRef.current = [...selectedTypes];
    loadingRef.current = true;
    
    const loadHeatmapData = async () => {
      setIsLoading(true);
      try {
        // Pass an empty array to get all types if none are selected
        const data = await loadGeoJsonFiles(selectedTypes.length > 0 ? selectedTypes : []);
        setHeatmapData(data);
        
        if (data.length > 0) {
          // Only show toast for significant changes
          const sizeDifference = Math.abs(data.length - heatmapData.length);
          if (sizeDifference > 100 || heatmapData.length === 0) {
            toast({
              title: "Map Updated",
              description: `Loaded ${data.length} waste data points. Zoom in and click on points for details.`,
            });
          }
        } else if (selectedTypes.length > 0) {
          toast({
            title: "No Data Found",
            description: "No waste data found for the selected filters",
          });
        }
      } catch (error) {
        console.error("Error in useHeatmapData:", error);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    };
    
    // Use setTimeout to avoid blocking the main thread
    const timerId = setTimeout(loadHeatmapData, 100);
    return () => clearTimeout(timerId);
  }, [selectedTypes]);

  return { isLoading, heatmapData };
};
