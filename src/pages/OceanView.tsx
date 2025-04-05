
import React, { useState, useEffect } from 'react';
import { Globe, Maximize, RefreshCw, Anchor } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch"

const OceanView = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        toast({
          title: "Fullscreen Error",
          description: "Unable to enter fullscreen mode",
          variant: "destructive",
        });
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const handleManualUpdate = () => {
    toast({
      title: "Update Triggered",
      description: "Ocean data is being refreshed",
    });
  };

  useEffect(() => {
    // Listen for iframe load event
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content - Full Screen */}
      <main className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="flex flex-col items-center">
              <div className="animate-pulse">
                <Globe className="w-16 h-16 text-ocean" />
              </div>
              <p className="mt-4 text-foreground/70">Loading Ocean View Explorer...</p>
            </div>
          </div>
        )}
        
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={toggleFullScreen}
            className="p-2 bg-background/50 backdrop-blur-sm rounded-full hover:bg-background/80 transition-colors"
            aria-label="Toggle fullscreen"
          >
            <Maximize className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Ocean Data Interface Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 flex justify-between">
          <motion.div 
            className="w-1/3 glass-container rounded-xl p-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-2">Pollution Statistics</h3>
            <p className="text-sm text-foreground/70 mb-2">Current detection summary</p>
            
            <div className="flex justify-between items-center mb-1">
              <span>Total Detections</span>
              <span className="font-semibold">9</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span>Recent (1h)</span>
              <span className="font-semibold">9</span>
            </div>
            
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <Anchor className="w-4 h-4 text-blue-400 mr-1" />
                <span className="text-sm">Avg Depth: <span className="font-semibold">2122m</span></span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 text-blue-400 mr-1">🌡️</span>
                <span className="text-sm">Avg Temp: <span className="font-semibold">9.8°C</span></span>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full inline-block mr-2"></span>
                  <span>High</span>
                </div>
                <span>3 (33%)</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full mb-2">
                <div className="h-2 bg-red-500 rounded-full" style={{ width: '33%' }}></div>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block mr-2"></span>
                  <span>Medium</span>
                </div>
                <span>1 (11%)</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full mb-2">
                <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '11%' }}></div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full inline-block mr-2"></span>
                  <span>Low</span>
                </div>
                <span>5 (56%)</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full mb-2">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '56%' }}></div>
              </div>
            </div>
            
            <h4 className="flex items-center text-sm font-semibold mb-2">
              <span className="mr-1">📍</span> Ocean Hotspots
            </h4>
            
            <div className="space-y-2">
              {[
                { name: 'Pacific Ocean', level: 'high' },
                { name: 'Indian Ocean', level: 'high' },
                { name: 'Atlantic Ocean', level: 'medium' },
                { name: 'Mediterranean Sea', level: 'medium' },
                { name: 'Caribbean Sea', level: 'low' }
              ].map((hotspot, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                    hotspot.level === 'high' ? 'border-red-500/30' : 
                    hotspot.level === 'medium' ? 'border-yellow-500/30' : 'border-green-500/30'
                  }`}
                >
                  <div className="flex items-center">
                    <Anchor className="w-4 h-4 mr-2" />
                    <span>{hotspot.name}</span>
                  </div>
                  <span className={
                    hotspot.level === 'high' ? 'text-red-500' : 
                    hotspot.level === 'medium' ? 'text-yellow-500' : 'text-green-500'
                  }>
                    {hotspot.level}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="w-1/3 glass-container rounded-xl p-4 mx-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-2">Recent Detections</h3>
            <p className="text-sm text-foreground/70 mb-3">Latest pollution discoveries</p>
            
            <div className="space-y-3">
              {[
                { type: 'Microplastics detected', time: '4/5/2025, 12:15:47 PM', level: 'low' },
                { type: 'Mixed pollution detected', time: '4/5/2025, 12:15:47 PM', level: 'high' },
                { type: 'Microplastics detected', time: '4/5/2025, 12:15:47 PM', level: 'medium' },
                { type: 'Industrial waste', time: '4/5/2025, 12:15:47 PM', level: 'low' }
              ].map((detection, index) => (
                <div 
                  key={index} 
                  className="p-3 glass-container rounded-lg"
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full inline-block mr-2 ${
                        detection.level === 'high' ? 'bg-red-500' : 
                        detection.level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></span>
                      <span>{detection.type}</span>
                    </div>
                    <span className={
                      detection.level === 'high' ? 'text-red-500' : 
                      detection.level === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }>
                      {detection.level}
                    </span>
                  </div>
                  <div className="text-sm text-foreground/70 pl-5">
                    {detection.time}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="w-1/4 glass-container rounded-xl p-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-2">Controls</h3>
            <p className="text-sm text-foreground/70 mb-3">Monitoring settings</p>
            
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 mr-2 text-blue-400" />
                <span>Real-time updates</span>
              </div>
              <Switch 
                checked={realTimeUpdates} 
                onCheckedChange={setRealTimeUpdates} 
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
            
            <div className="mb-5">
              <label className="block mb-2">Update interval</label>
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-slate-800 border border-slate-700 rounded-lg p-2 pr-8 text-white"
                  defaultValue="10"
                >
                  <option value="5">Every 5 seconds</option>
                  <option value="10">Every 10 seconds</option>
                  <option value="30">Every 30 seconds</option>
                  <option value="60">Every 1 minute</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleManualUpdate}
              className="w-full flex items-center justify-center py-2 px-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              <span>Manual update</span>
            </button>
          </motion.div>
        </div>
        
        <motion.div 
          className="w-full h-[calc(100vh-64px)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0.3 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <iframe 
            src="https://ocean-eye-3v9c.vercel.app/" 
            title="Ocean View Explorer" 
            className="w-full h-full border-0" 
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default OceanView;
