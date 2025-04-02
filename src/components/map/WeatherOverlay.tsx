
import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudRain, Wind, X, Thermometer } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const WeatherOverlay = () => {
  const map = useMap();
  const [isEnabled, setIsEnabled] = useState(false);
  const [weatherType, setWeatherType] = useState<'clouds' | 'precipitation' | 'wind' | 'temp'>('clouds');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  useEffect(() => {
    if (!map) return;
    
    // Create weather control
    const weatherControl = L.Control.extend({
      options: {
        position: 'topright'
      },
      
      onAdd: function() {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.innerHTML = `
          <button 
            class="bg-card/80 backdrop-blur-sm hover:bg-card/90 p-2 flex items-center justify-center rounded-md shadow-md"
            title="Weather Overlay"
          >
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
              </svg>
            </span>
          </button>
        `;
        
        L.DomEvent.on(container.querySelector('button'), 'click', function() {
          toggleWeather();
        });
        
        return container;
      }
    });
    
    map.addControl(new weatherControl());
    
    const toggleWeather = () => {
      setIsEnabled(!isEnabled);
      setIsSettingsOpen(!isEnabled);
      
      if (!isEnabled) {
        toast({
          title: "Weather Overlay Enabled",
          description: "Now showing cloud coverage data",
        });
      } else {
        // Remove overlays when disabled
        if (map.hasLayer(cloudsLayer)) {
          map.removeLayer(cloudsLayer);
        }
        if (map.hasLayer(precipLayer)) {
          map.removeLayer(precipLayer);
        }
        if (map.hasLayer(windLayer)) {
          map.removeLayer(windLayer);
        }
        if (map.hasLayer(tempLayer)) {
          map.removeLayer(tempLayer);
        }
      }
    };
    
    // Create layers
    const cloudsLayer = L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2', {
      maxZoom: 19,
      opacity: 0.5
    });
    
    const precipLayer = L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2', {
      maxZoom: 19,
      opacity: 0.5
    });
    
    const windLayer = L.tileLayer('https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2', {
      maxZoom: 19,
      opacity: 0.5
    });
    
    const tempLayer = L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2', {
      maxZoom: 19,
      opacity: 0.5
    });
    
    // Update shown layer based on selection
    if (isEnabled) {
      if (weatherType === 'clouds') {
        if (!map.hasLayer(cloudsLayer)) {
          map.addLayer(cloudsLayer);
        }
        if (map.hasLayer(precipLayer)) map.removeLayer(precipLayer);
        if (map.hasLayer(windLayer)) map.removeLayer(windLayer);
        if (map.hasLayer(tempLayer)) map.removeLayer(tempLayer);
      } else if (weatherType === 'precipitation') {
        if (map.hasLayer(cloudsLayer)) map.removeLayer(cloudsLayer);
        if (!map.hasLayer(precipLayer)) map.addLayer(precipLayer);
        if (map.hasLayer(windLayer)) map.removeLayer(windLayer);
        if (map.hasLayer(tempLayer)) map.removeLayer(tempLayer);
      } else if (weatherType === 'wind') {
        if (map.hasLayer(cloudsLayer)) map.removeLayer(cloudsLayer);
        if (map.hasLayer(precipLayer)) map.removeLayer(precipLayer);
        if (!map.hasLayer(windLayer)) map.addLayer(windLayer);
        if (map.hasLayer(tempLayer)) map.removeLayer(tempLayer);
      } else if (weatherType === 'temp') {
        if (map.hasLayer(cloudsLayer)) map.removeLayer(cloudsLayer);
        if (map.hasLayer(precipLayer)) map.removeLayer(precipLayer);
        if (map.hasLayer(windLayer)) map.removeLayer(windLayer);
        if (!map.hasLayer(tempLayer)) map.addLayer(tempLayer);
      }
    }
    
    return () => {
      // Clean up on unmount
      if (map.hasLayer(cloudsLayer)) map.removeLayer(cloudsLayer);
      if (map.hasLayer(precipLayer)) map.removeLayer(precipLayer);
      if (map.hasLayer(windLayer)) map.removeLayer(windLayer);
      if (map.hasLayer(tempLayer)) map.removeLayer(tempLayer);
    };
  }, [map, isEnabled, weatherType]);
  
  if (!isEnabled) return null;
  
  return (
    <>
      <motion.div
        className="absolute top-16 right-4 bg-card/90 backdrop-blur-md px-2 py-1 rounded-xl shadow-lg z-[500]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center text-xs font-medium">
          <Cloud className="w-3 h-3 mr-1 text-ocean" />
          <span>Weather data overlay active</span>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            className="absolute top-24 right-4 bg-card/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/10 z-[500] w-56"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium flex items-center">
                <Cloud className="w-3.5 h-3.5 mr-1.5 text-ocean" />
                Weather Options
              </h3>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setIsSettingsOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`flex flex-col items-center justify-center p-2 rounded text-xs ${weatherType === 'clouds' ? 'bg-ocean/20 border border-ocean/40' : 'bg-background/30 hover:bg-background/50'}`}
                onClick={() => setWeatherType('clouds')}
              >
                <Cloud className="w-5 h-5 mb-1" />
                <span>Clouds</span>
              </button>
              
              <button
                className={`flex flex-col items-center justify-center p-2 rounded text-xs ${weatherType === 'precipitation' ? 'bg-ocean/20 border border-ocean/40' : 'bg-background/30 hover:bg-background/50'}`}
                onClick={() => setWeatherType('precipitation')}
              >
                <CloudRain className="w-5 h-5 mb-1" />
                <span>Precipitation</span>
              </button>
              
              <button
                className={`flex flex-col items-center justify-center p-2 rounded text-xs ${weatherType === 'wind' ? 'bg-ocean/20 border border-ocean/40' : 'bg-background/30 hover:bg-background/50'}`}
                onClick={() => setWeatherType('wind')}
              >
                <Wind className="w-5 h-5 mb-1" />
                <span>Wind</span>
              </button>
              
              <button
                className={`flex flex-col items-center justify-center p-2 rounded text-xs ${weatherType === 'temp' ? 'bg-ocean/20 border border-ocean/40' : 'bg-background/30 hover:bg-background/50'}`}
                onClick={() => setWeatherType('temp')}
              >
                <Thermometer className="w-5 h-5 mb-1" />
                <span>Temperature</span>
              </button>
            </div>
            
            <div className="text-xs text-gray-400 mt-2">
              Weather data affects marine waste movement patterns
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WeatherOverlay;
