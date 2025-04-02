
import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, X, ChevronRight, ChevronDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import * as L from "leaflet";

interface RegionData {
  region: string;
  wasteAmount: number;
  changePercent: number;
  types: { type: string; percentage: number }[];
}

const ComparativeAnalysis = () => {
  const map = useMap();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [showRegionSelector, setShowRegionSelector] = useState(false);
  
  // Sample data for regions
  const regionData: RegionData[] = [
    {
      region: "North Pacific",
      wasteAmount: 96500,
      changePercent: 3.2,
      types: [
        { type: "Plastic Waste", percentage: 68 },
        { type: "Fishing Gear", percentage: 18 },
        { type: "Industrial Waste", percentage: 14 }
      ]
    },
    {
      region: "South Pacific",
      wasteAmount: 58200,
      changePercent: -1.8,
      types: [
        { type: "Plastic Waste", percentage: 72 },
        { type: "Fishing Gear", percentage: 12 },
        { type: "Industrial Waste", percentage: 16 }
      ]
    },
    {
      region: "North Atlantic",
      wasteAmount: 72400,
      changePercent: 2.5,
      types: [
        { type: "Plastic Waste", percentage: 59 },
        { type: "Fishing Gear", percentage: 22 },
        { type: "Industrial Waste", percentage: 19 }
      ]
    },
    {
      region: "South Atlantic",
      wasteAmount: 47300,
      changePercent: 0.7,
      types: [
        { type: "Plastic Waste", percentage: 65 },
        { type: "Fishing Gear", percentage: 14 },
        { type: "Industrial Waste", percentage: 21 }
      ]
    },
    {
      region: "Indian Ocean",
      wasteAmount: 68900,
      changePercent: 4.1,
      types: [
        { type: "Plastic Waste", percentage: 74 },
        { type: "Fishing Gear", percentage: 11 },
        { type: "Industrial Waste", percentage: 15 }
      ]
    },
    {
      region: "Mediterranean",
      wasteAmount: 23700,
      changePercent: 5.6,
      types: [
        { type: "Plastic Waste", percentage: 78 },
        { type: "Fishing Gear", percentage: 9 },
        { type: "Industrial Waste", percentage: 13 }
      ]
    }
  ];
  
  // Get filtered data
  const filteredData = regionData.filter(data => selectedRegions.includes(data.region));
  
  // Toggle region selection
  const toggleRegion = (region: string) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(prev => prev.filter(r => r !== region));
    } else {
      if (selectedRegions.length < 3) {
        setSelectedRegions(prev => [...prev, region]);
        
        // Show toast for first selection
        if (selectedRegions.length === 0) {
          toast({
            title: "Region Selected",
            description: "You can select up to 3 regions to compare",
          });
        }
      } else {
        toast({
          title: "Maximum Regions Selected",
          description: "You can only compare up to 3 regions at once",
          variant: "destructive"
        });
      }
    }
  };
  
  // Function to get color based on percentage change
  const getChangeColor = (percent: number) => {
    if (percent > 0) return "text-red-400";
    if (percent < 0) return "text-green-400";
    return "text-gray-400";
  };
  
  // Add control button to the map
  useEffect(() => {
    if (!map) return;
    
    const compareControl = L.Control.extend({
      options: {
        position: 'topleft'
      },
      
      onAdd: function() {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.innerHTML = `
          <button 
            class="bg-card/80 backdrop-blur-sm hover:bg-card/90 p-2 flex items-center justify-center rounded-md shadow-md"
            title="Compare Regions"
          >
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="8" width="18" height="4" rx="1"/>
                <rect x="3" y="16" width="18" height="4" rx="1"/>
              </svg>
            </span>
          </button>
        `;
        
        L.DomEvent.on(container.querySelector('button'), 'click', function() {
          setIsOpen(!isOpen);
        });
        
        return container;
      }
    });
    
    map.addControl(new compareControl());
  }, [map, isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <motion.div 
      className="absolute left-4 top-16 bg-card/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10 z-[500] w-80"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold flex items-center text-sm">
          <BarChart3 className="w-4 h-4 mr-1.5 text-ocean" />
          Regional Comparison
        </h3>
        <button 
          className="text-gray-400 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Region selector */}
      <button
        className="w-full text-left flex items-center justify-between text-xs bg-background/40 py-2 px-3 rounded-md mb-3"
        onClick={() => setShowRegionSelector(!showRegionSelector)}
      >
        <span>
          {selectedRegions.length === 0 ? 'Select regions to compare' : 
           `Comparing ${selectedRegions.length} ${selectedRegions.length === 1 ? 'region' : 'regions'}`}
        </span>
        {showRegionSelector ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
      
      <AnimatePresence>
        {showRegionSelector && (
          <motion.div 
            className="bg-background/30 rounded-md p-2 mb-4 grid grid-cols-2 gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {regionData.map(region => (
              <div 
                key={region.region}
                className={`px-2 py-1 rounded text-xs cursor-pointer flex items-center ${
                  selectedRegions.includes(region.region) 
                  ? 'bg-ocean/20 border border-ocean/30' 
                  : 'bg-background/20 hover:bg-background/40'
                }`}
                onClick={() => toggleRegion(region.region)}
              >
                <div className={`w-2 h-2 rounded-full mr-1.5 ${
                  selectedRegions.includes(region.region) ? 'bg-ocean' : 'bg-gray-500'
                }`} />
                <span>{region.region}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Comparative data */}
      {selectedRegions.length > 0 ? (
        <div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {filteredData.map(data => (
              <div key={data.region} className="bg-background/30 p-2 rounded-md text-center">
                <div className="text-xs text-gray-400 mb-1">{data.region}</div>
                <div className="text-sm font-medium">{(data.wasteAmount / 1000).toFixed(1)}k</div>
                <div className={`text-xs ${getChangeColor(data.changePercent)}`}>
                  {data.changePercent > 0 ? '+' : ''}{data.changePercent}%
                </div>
              </div>
            ))}
          </div>
          
          {/* Type breakdown */}
          <div className="mb-3">
            <div className="text-xs text-gray-400 mb-1.5">Waste Type Distribution</div>
            {['Plastic Waste', 'Fishing Gear', 'Industrial Waste'].map(type => (
              <div key={type} className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>{type}</span>
                  <div className="flex gap-3">
                    {filteredData.map(data => (
                      <span key={`${data.region}-${type}`}>
                        {data.types.find(t => t.type === type)?.percentage}%
                      </span>
                    ))}
                  </div>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden flex">
                  {filteredData.map((data, index) => {
                    const typeData = data.types.find(t => t.type === type);
                    const color = index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500';
                    return (
                      <div 
                        key={`bar-${data.region}-${type}`}
                        className={`h-full ${color}`}
                        style={{ width: `${100 / filteredData.length}%`, opacity: (typeData?.percentage || 0) / 100 }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Yearly trend mini chart */}
          <div>
            <div className="text-xs text-gray-400 mb-1.5">Yearly Trend</div>
            <div className="h-16 flex items-end">
              {filteredData.map((data, dataIndex) => (
                <div 
                  key={`trend-${data.region}`}
                  className="flex-1 flex items-end justify-around h-full"
                >
                  {[1, 2, 3, 4, 5].map(year => {
                    // Generate random but consistent trend data
                    const seedValue = (dataIndex + 1) * year;
                    const height = 30 + (seedValue % 40);
                    const color = dataIndex === 0 ? 'bg-blue-500' : dataIndex === 1 ? 'bg-green-500' : 'bg-purple-500';
                    
                    return (
                      <div 
                        key={`${data.region}-year-${year}`}
                        className={`w-1 ${color} rounded-t`}
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>2020</span>
              <span>2024</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-sm text-gray-400">
          Select regions to compare waste data
        </div>
      )}
    </motion.div>
  );
};

export default ComparativeAnalysis;
