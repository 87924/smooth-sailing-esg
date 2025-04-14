
import React, { useState, useEffect } from 'react';
import { Globe, Maximize, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "@/components/ui/use-toast";

const OceanView = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(true);

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

  useEffect(() => {
    // Listen for iframe load event
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Auto-dismiss alert after 15 seconds
    const alertTimer = setTimeout(() => {
      setShowAlert(false);
    }, 15000);

    return () => {
      clearTimeout(timer);
      clearTimeout(alertTimer);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Oil Contamination Alert */}
      <AnimatePresence>
        {showAlert && (
          <motion.div 
            className="fixed top-4 right-4 max-w-[280px] z-50"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-amber-950/80 backdrop-blur-sm text-amber-50 p-3 rounded-lg shadow-lg border border-amber-700/50 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Oil Contamination Alert</h4>
                <p className="text-xs text-amber-200 mt-1">High concentration detected in monitored area</p>
                <div className="mt-2">
                  <span className="inline-block bg-amber-700/40 text-amber-100 text-xs px-2 py-0.5 rounded">
                    API Connected
                  </span>
                </div>
              </div>
              <button 
                className="text-amber-400 hover:text-amber-200 transition-colors ml-auto"
                onClick={() => setShowAlert(false)}
                aria-label="Close alert"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
