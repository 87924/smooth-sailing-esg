
import { useState, useEffect } from "react";
import { loadGeoJsonFiles } from "@/utils/geojsonLoader";
import { toast } from "@/components/ui/use-toast";

interface Point {
  lat: number;
  lng: number;
  type: string;
  intensity: number;
}

export const useHeatmapData = (selectedTypes: string[]) => {
  const [isLoading, setIsLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<[number, number, number][]>([]);
  const [rawData, setRawData] = useState<Point[]>([]);

  useEffect(() => {
    const loadHeatmapData = async () => {
      setIsLoading(true);
      try {
        const { points, rawPoints } = await loadGeoJsonFiles(selectedTypes);
        setHeatmapData(points);
        setRawData(rawPoints);
        
        if (points.length > 0) {
          toast({
            title: "Map Updated",
            description: `Loaded ${points.length} waste data points`,
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

  return { isLoading, heatmapData, rawData };
};
