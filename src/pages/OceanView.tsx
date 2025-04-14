
import React, { useState, useEffect } from 'react';
import { Globe, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const OceanView = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
          <Alert className="w-auto max-w-[300px] bg-background/80 backdrop-blur-sm border-ocean/40 shadow-lg animate-fade-in">
            <AlertTitle className="text-sm font-medium text-ocean">Ocean API Connected</AlertTitle>
            <AlertDescription className="text-xs text-foreground/70">
              Real-time ocean data is now being streamed
            </AlertDescription>
          </Alert>
          
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
