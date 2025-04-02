
import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Mountain } from "lucide-react";
import * as L from "leaflet";

const TerrainVisualization = () => {
  const map = useMap();
  const terrainsEnabled = useRef(false);
  const [terrainControl, setTerrainControl] = useState<L.Control | null>(null);
  
  useEffect(() => {
    if (!map) return;
    
    // Only add control if it doesn't exist yet
    if (!terrainControl) {
      // Add terrain button to the map
      const control = L.Control.extend({
        options: {
          position: 'bottomleft'
        },
        
        onAdd: function() {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
          container.innerHTML = `
            <button 
              class="bg-card/80 backdrop-blur-sm hover:bg-card/90 p-2 flex items-center justify-center rounded-md shadow-md"
              title="Toggle 3D Terrain"
            >
              <span class="mountains-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
                </svg>
              </span>
            </button>
          `;
          
          L.DomEvent.on(container.querySelector('button'), 'click', function() {
            toggleTerrain();
          });
          
          return container;
        }
      });
      
      const newControl = new control();
      map.addControl(newControl);
      setTerrainControl(newControl);
    }
    
    // Function to toggle terrain
    const toggleTerrain = () => {
      terrainsEnabled.current = !terrainsEnabled.current;
      
      if (terrainsEnabled.current) {
        // Apply 3D effect
        map.getPane('mapPane')!.style.transform = 'perspective(1000px) rotateX(30deg)';
        map.getPane('mapPane')!.style.transition = 'transform 1s';
        
        // Add hillshade layer (using a placeholder URL)
        fetch('https://api.mapbox.com/v4/mapbox.terrain-rgb/7/20/40.pngraw?access_token=pk.eyJ1IjoiaWJyYWhpbWFsaTA3ODYiLCJhIjoiY20yYWRiZWw0MGQxZDJvczd6bzc4aDUzMiJ9.FUTLwMNaICKfoct8yJqVQQ')
          .then(() => {
            toast({
              title: "3D Terrain Enabled",
              description: "Terrain visualization is now active",
            });
          })
          .catch(err => console.error("Terrain fetch error:", err));
      } else {
        // Remove 3D effect
        map.getPane('mapPane')!.style.transform = 'none';
        
        toast({
          title: "3D Terrain Disabled",
          description: "Terrain visualization is now inactive",
        });
      }
    };
    
    return () => {
      // Reset on unmount
      if (map.getPane('mapPane')) {
        map.getPane('mapPane')!.style.transform = 'none';
      }
      
      // Remove control if it exists
      if (terrainControl) {
        map.removeControl(terrainControl);
      }
    };
  }, [map, terrainControl]);
  
  return null;
};

export default TerrainVisualization;
