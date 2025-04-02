
import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import { motion } from "framer-motion";
import { Grid, Group, CircleDot } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import * as L from "leaflet";

interface ClusteringControlProps {
  clusteringEnabled: boolean;
  setClusteringEnabled: (enabled: boolean) => void;
}

const ClusteringControl = ({ clusteringEnabled, setClusteringEnabled }: ClusteringControlProps) => {
  const map = useMap();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [clusterSize, setClusterSize] = useState(50);
  
  useEffect(() => {
    if (!map) return;
    
    // Create clustering control
    const clusterControl = L.Control.extend({
      options: {
        position: 'topleft'
      },
      
      onAdd: function() {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.innerHTML = `
          <button 
            class="bg-card/80 backdrop-blur-sm hover:bg-card/90 p-2 flex items-center justify-center rounded-md shadow-md"
            title="Clustering Options"
          >
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="12" r="3"/>
                <line x1="9" y1="12" x2="15" y2="12"/>
              </svg>
            </span>
          </button>
        `;
        
        L.DomEvent.on(container.querySelector('button'), 'click', function() {
          setIsSettingsOpen(!isSettingsOpen);
        });
        
        return container;
      }
    });
    
    map.addControl(new clusterControl());
    
    // When clustering is enabled, show a toast
    if (clusteringEnabled) {
      toast({
        title: "Clustering Enabled",
        description: "Data points are now grouped for better visualization",
      });
    }
  }, [map, isSettingsOpen, clusteringEnabled]);
  
  const handleClusteringToggle = () => {
    setClusteringEnabled(!clusteringEnabled);
  };
  
  const handleClusterSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    setClusterSize(newSize);
  };
  
  return (
    <>
      {clusteringEnabled && (
        <motion.div
          className="absolute top-16 left-16 bg-card/90 backdrop-blur-md px-2 py-1 rounded-xl shadow-lg z-[500]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center text-xs font-medium">
            <Group className="w-3 h-3 mr-1 text-ocean" />
            <span>Clustering active</span>
          </div>
        </motion.div>
      )}
      
      {isSettingsOpen && (
        <motion.div
          className="absolute top-16 left-4 bg-card/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/10 z-[500] w-64"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="text-sm font-medium flex items-center mb-3">
            <Grid className="w-4 h-4 mr-1.5 text-ocean" />
            Clustering Options
          </h3>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm">Enable Clustering</span>
            <button 
              className={`relative w-11 h-6 rounded-full transition-colors ${clusteringEnabled ? 'bg-ocean' : 'bg-gray-600'}`}
              onClick={handleClusteringToggle}
            >
              <span 
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${clusteringEnabled ? 'translate-x-5' : ''}`}
              />
            </button>
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Cluster Radius</span>
              <span className="text-ocean">{clusterSize}px</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="100"
              value={clusterSize}
              onChange={handleClusterSizeChange}
              className="w-full accent-ocean"
              disabled={!clusteringEnabled}
            />
          </div>
          
          <div className="text-xs text-gray-400 mt-2">
            Clustering groups nearby points together for cleaner visualization at lower zoom levels
          </div>
          
          <div className="mt-3 flex gap-3 text-xs">
            <div className="flex items-center">
              <CircleDot className="w-3 h-3 mr-1" />
              <span>Individual points</span>
            </div>
            <div className="flex items-center">
              <Group className="w-3 h-3 mr-1 text-ocean" />
              <span>Clusters</span>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ClusteringControl;
