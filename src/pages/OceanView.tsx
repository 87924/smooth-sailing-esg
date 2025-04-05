
import React, { useState } from 'react';
import { Globe, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

const OceanView = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  return (
    <div className="pt-20 min-h-screen flex flex-col">
      {/* Page Header */}
      <header className="py-6 px-4">
        <div className="container mx-auto">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Globe className="mr-2 text-ocean" />
              Ocean View Explorer
            </h1>
            <p className="text-foreground/70">
              Interactive 3D visualization of the world's oceans and marine pollution
            </p>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 px-4 pb-8">
        <div className="container mx-auto">
          <div className="relative glass-container rounded-xl overflow-hidden shadow-lg border border-white/10">
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={toggleFullScreen}
                className="p-2 bg-background/50 backdrop-blur-sm rounded-full hover:bg-background/80 transition-colors"
                aria-label="Toggle fullscreen"
              >
                <Maximize className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <motion.div 
              className="w-full h-[calc(100vh-220px)] min-h-[500px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <iframe 
                src="https://ocean-eye-3v9c.vercel.app/" 
                title="Ocean View Explorer" 
                className="w-full h-full border-0" 
                allowFullScreen
              />
            </motion.div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-container p-5 rounded-xl">
              <h3 className="font-bold text-lg mb-2 text-ocean">Real-Time Visualization</h3>
              <p className="text-foreground/70">
                Explore the world's oceans with this interactive 3D model showing marine pollution hotspots and ocean currents.
              </p>
            </div>
            
            <div className="glass-container p-5 rounded-xl">
              <h3 className="font-bold text-lg mb-2 text-ocean">Environmental Impact</h3>
              <p className="text-foreground/70">
                Visualize the consequences of human activities on marine ecosystems and track the spread of ocean waste.
              </p>
            </div>
            
            <div className="glass-container p-5 rounded-xl">
              <h3 className="font-bold text-lg mb-2 text-ocean">Global Monitoring</h3>
              <p className="text-foreground/70">
                Access satellite data and environmental sensors to monitor ocean health and identify areas requiring intervention.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OceanView;
