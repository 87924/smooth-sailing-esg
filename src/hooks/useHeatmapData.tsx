
import { useState, useEffect } from "react";
import { loadGeoJsonFiles } from "@/utils/geojsonLoader";
import { toast } from "@/components/ui/use-toast";

export const useHeatmapData = (selectedTypes: string[]) => {
  const [isLoading, setIsLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<[number, number, number][]>([]);

  useEffect(() => {
    const loadHeatmapData = async () => {
      setIsLoading(true);
      try {
        const data = await loadGeoJsonFiles(selectedTypes);
        setHeatmapData(data);
        
        if (data.length > 0) {
          toast({
            title: "Map Updated",
            description: `Loaded ${data.length} waste data points`,
          });
        } else {
          toast({
            title: "No Data Found",
            description: "No waste data found for the selected filters",
          });
        }
      } catch (error) {
        console.error("Error in useHeatmapData:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHeatmapData();
  }, [selectedTypes]);

  return { isLoading, heatmapData };
};
