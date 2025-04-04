
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
        const data = await loadGeoJsonFiles(selectedTypes);
        setHeatmapData(data);
        
        // Only show toast for significant updates - to avoid toast spam
        if (heatmapData.length === 0) {
          toast({
            title: "Map Ready",
            description: `Displaying ${data.length} data points`,
          });
        }
      } catch (error) {
        console.error("Error in useHeatmapData:", error);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    };
    
    // Reduce timeout to load data faster
    loadHeatmapData();
  }, [selectedTypes]);

  return { isLoading, heatmapData };
};
