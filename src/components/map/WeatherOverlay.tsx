
import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Wind, Droplets, Thermometer, SunMedium, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import * as L from "leaflet";

const WeatherOverlay = () => {
  const map = useMap();
  const [isOpen, setIsOpen] = useState(false);
  const [weatherType, setWeatherType] = useState<'temperature' | 'precipitation' | 'wind' | 'clouds'>('temperature');
  const [isLoading, setIsLoading] = useState(false);
  const [weatherControl, setWeatherControl] = useState<L.Control | null>(null);
  const [activeLayers, setActiveLayers] = useState<{[key: string]: L.TileLayer | null}>({
    temperature: null,
    precipitation: null,
    wind: null,
    clouds: null
  });
  
  useEffect(() => {
    if (!map) return;
    
    // Only add the control if it doesn't exist yet
    if (!weatherControl) {
      // Add weather control button
      const control = L.Control.extend({
        options: {
          position: 'topright'
        },
        
        onAdd: function() {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
          container.innerHTML = `
            <button 
              class="bg-card/80 backdrop-blur-sm hover:bg-card/90 p-2 flex items-center justify-center rounded-md shadow-md"
              title="Weather Layer"
            >
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"/>
                  <path d="M16 20h-5.2c-.68 0-1.3-.3-1.7-.8"/>
                  <path d="M12 8a2 2 0 1 0 4 0 2 2 0 0 0-4 0"/>
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
      
      const newControl = new control();
      map.addControl(newControl);
      setWeatherControl(newControl);
    }
    
    // Function to create weather layers
    const createWeatherLayers = () => {
      // Using OpenWeatherMap API placeholder - users would need their own API key
      const temperatureLayer = L.tileLayer(
        'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY', 
        {
          maxZoom: 19,
          opacity: 0.6,
          attribution: '&copy; <a href="https://openweathermap.org/copyright">OpenWeatherMap</a>'
        }
      );
      
      const precipitationLayer = L.tileLayer(
        'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY', 
        {
          maxZoom: 19,
          opacity: 0.6,
          attribution: '&copy; <a href="https://openweathermap.org/copyright">OpenWeatherMap</a>'
        }
      );
      
      const windLayer = L.tileLayer(
        'https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY', 
        {
          maxZoom: 19,
          opacity: 0.6,
          attribution: '&copy; <a href="https://openweathermap.org/copyright">OpenWeatherMap</a>'
        }
      );
      
      const cloudsLayer = L.tileLayer(
        'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY', 
        {
          maxZoom: 19,
          opacity: 0.6,
          attribution: '&copy; <a href="https://openweathermap.org/copyright">OpenWeatherMap</a>'
        }
      );
      
      setActiveLayers({
        temperature: temperatureLayer,
        precipitation: precipitationLayer,
        wind: windLayer,
        clouds: cloudsLayer
      });
    };
    
    createWeatherLayers();
    
    // Cleanup layers on unmount
    return () => {
      if (weatherControl) {
        map.removeControl(weatherControl);
      }
      
      Object.values(activeLayers).forEach(layer => {
        if (layer) layer.remove();
      });
    };
  }, [map]);
  
  // Handle weather type change
  const handleWeatherTypeChange = (type: 'temperature' | 'precipitation' | 'wind' | 'clouds') => {
    if (!map) return;
    
    setIsLoading(true);
    setWeatherType(type);
    
    // Remove all active layers
    Object.values(activeLayers).forEach(layer => {
      if (layer && map.hasLayer(layer)) {
        layer.remove();
      }
    });
    
    // Add selected layer
    const selectedLayer = activeLayers[type];
    if (selectedLayer) {
      selectedLayer.addTo(map);
      
      // Show loading effect
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Weather Layer Updated",
          description: `Now showing ${type} data`,
        });
      }, 800);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div 
      className="absolute right-4 top-16 bg-card/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10 z-[500] w-64"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold flex items-center">
          <Cloud className="w-4 h-4 mr-1.5 text-ocean" />
          Weather Overlay
        </h3>
        <button 
          className="text-gray-400 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button 
          className={`p-2 rounded-lg flex flex-col items-center justify-center ${weatherType === 'temperature' ? 'bg-ocean/20 border border-ocean/40' : 'bg-background/40 hover:bg-background/60'}`}
          onClick={() => handleWeatherTypeChange('temperature')}
        >
          <Thermometer className="w-5 h-5 mb-1" />
          <span className="text-xs">Temperature</span>
        </button>
        
        <button 
          className={`p-2 rounded-lg flex flex-col items-center justify-center ${weatherType === 'precipitation' ? 'bg-ocean/20 border border-ocean/40' : 'bg-background/40 hover:bg-background/60'}`}
          onClick={() => handleWeatherTypeChange('precipitation')}
        >
          <Droplets className="w-5 h-5 mb-1" />
          <span className="text-xs">Precipitation</span>
        </button>
        
        <button 
          className={`p-2 rounded-lg flex flex-col items-center justify-center ${weatherType === 'wind' ? 'bg-ocean/20 border border-ocean/40' : 'bg-background/40 hover:bg-background/60'}`}
          onClick={() => handleWeatherTypeChange('wind')}
        >
          <Wind className="w-5 h-5 mb-1" />
          <span className="text-xs">Wind</span>
        </button>
        
        <button 
          className={`p-2 rounded-lg flex flex-col items-center justify-center ${weatherType === 'clouds' ? 'bg-ocean/20 border border-ocean/40' : 'bg-background/40 hover:bg-background/60'}`}
          onClick={() => handleWeatherTypeChange('clouds')}
        >
          <Cloud className="w-5 h-5 mb-1" />
          <span className="text-xs">Clouds</span>
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-3">
          <div className="animate-spin h-5 w-5 border-2 border-ocean border-t-transparent rounded-full mr-2" />
          <span className="text-sm">Loading weather data...</span>
        </div>
      ) : (
        <div className="bg-background/40 p-2 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {weatherType === 'temperature' && <Thermometer className="w-4 h-4 mr-1.5 text-red-400" />}
              {weatherType === 'precipitation' && <Droplets className="w-4 h-4 mr-1.5 text-blue-400" />}
              {weatherType === 'wind' && <Wind className="w-4 h-4 mr-1.5 text-green-400" />}
              {weatherType === 'clouds' && <Cloud className="w-4 h-4 mr-1.5 text-gray-400" />}
              <span className="text-sm font-medium capitalize">{weatherType} Layer</span>
            </div>
            <span className="text-xs bg-background/60 px-2 py-0.5 rounded">Active</span>
          </div>
          
          <div className="mt-2 text-xs text-gray-400">
            Weather data affects marine waste movement and degradation rates.
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeatherOverlay;
