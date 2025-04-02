
import React, { useState } from "react";
import { useMap } from "react-leaflet";
import { Camera, Check, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";

const MapScreenshot = () => {
  const map = useMap();
  const [isCapturing, setIsCapturing] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  
  const captureMap = async () => {
    if (!map) return;
    
    try {
      setIsCapturing(true);
      
      // Small delay to ensure UI updates before capture
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture the map container
      const mapContainer = map.getContainer();
      const canvas = await html2canvas(mapContainer, {
        useCORS: true,
        allowTaint: true,
        logging: false,
        scale: window.devicePixelRatio
      });
      
      // Convert to image URL
      const imageUrl = canvas.toDataURL("image/png");
      setScreenshotUrl(imageUrl);
      
      toast({
        title: "Screenshot captured",
        description: "Your map screenshot is ready to download",
      });
    } catch (error) {
      console.error("Error capturing map:", error);
      toast({
        variant: "destructive",
        title: "Screenshot failed",
        description: "There was an error capturing the map",
      });
    } finally {
      setIsCapturing(false);
    }
  };
  
  const handleDownload = () => {
    if (!screenshotUrl) return;
    
    const link = document.createElement("a");
    link.href = screenshotUrl;
    link.download = `marine-map-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Close preview after download
    setScreenshotUrl(null);
  };
  
  const cancelScreenshot = () => {
    setScreenshotUrl(null);
  };
  
  return (
    <>
      <div className="absolute top-28 right-4 z-[1000]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={captureMap}
          disabled={isCapturing}
          className="bg-card/80 backdrop-blur-md p-2 rounded-lg shadow-lg border border-white/10 hover:bg-card/90 transition-colors"
          title="Capture map screenshot"
        >
          {isCapturing ? (
            <div className="w-5 h-5 rounded-full border-2 border-ocean border-t-transparent animate-spin" />
          ) : (
            <Camera className="w-5 h-5" />
          )}
        </motion.button>
      </div>
      
      <AnimatePresence>
        {screenshotUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2000] flex items-center justify-center p-6"
          >
            <div className="bg-card rounded-xl shadow-2xl overflow-hidden max-w-4xl max-h-[90vh] w-full flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-semibold">Map Screenshot</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 bg-ocean hover:bg-ocean/80 text-white px-3 py-1.5 rounded-md text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={cancelScreenshot}
                    className="p-1.5 hover:bg-secondary/50 rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-auto p-4 flex-grow">
                <img 
                  src={screenshotUrl} 
                  alt="Map Screenshot" 
                  className="max-w-full h-auto rounded-md shadow-md" 
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MapScreenshot;
