
import { useState } from "react";
import { useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Camera, Twitter, Facebook, Linkedin, Copy, Check, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const SocialShare = () => {
  const map = useMap();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  
  // Generate share URL with map position
  const generateShareURL = () => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?lat=${center.lat.toFixed(5)}&lng=${center.lng.toFixed(5)}&zoom=${zoom}`;
  };
  
  // Take screenshot of the current map view
  const takeScreenshot = () => {
    try {
      // Find the map container
      const mapContainer = document.querySelector('.leaflet-container');
      if (!mapContainer) return;
      
      // Use html2canvas to capture the map (simulated here)
      setTimeout(() => {
        // In a real implementation, we would use html2canvas or similar
        // For demo purposes, we'll just use a placeholder
        setScreenshot('https://via.placeholder.com/600x400/0A2342/FFFFFF?text=Map+Screenshot');
        
        toast({
          title: "Screenshot Captured",
          description: "You can now share this discovery with others",
        });
      }, 1000);
    } catch (error) {
      console.error("Error taking screenshot:", error);
      toast({
        variant: "destructive",
        title: "Screenshot Failed",
        description: "Unable to capture the current map view",
      });
    }
  };
  
  // Copy share URL to clipboard
  const copyToClipboard = () => {
    const shareUrl = generateShareURL();
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Link Copied",
        description: "Share URL has been copied to clipboard",
      });
    });
  };
  
  // Share on social media
  const shareOnPlatform = (platform: string) => {
    const shareUrl = generateShareURL();
    const text = "Check out this marine waste hotspot I discovered!";
    
    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    
    if (url) {
      window.open(url, "_blank", "width=600,height=400");
      toast({
        title: "Sharing Discovery",
        description: `Opening share dialog for ${platform}`,
      });
    }
  };
  
  // Add share button to map
  useEffect(() => {
    if (!map) return;
    
    const shareControl = L.Control.extend({
      options: {
        position: 'topright'
      },
      
      onAdd: function() {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.innerHTML = `
          <button 
            class="bg-card/80 backdrop-blur-sm hover:bg-card/90 p-2 flex items-center justify-center rounded-md shadow-md"
            title="Share Discovery"
          >
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
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
    
    map.addControl(new shareControl());
  }, [map, isOpen]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="absolute right-16 top-4 bg-card/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10 z-[500] w-72"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold flex items-center">
              <Share2 className="w-4 h-4 mr-1.5 text-ocean" />
              Share Discovery
            </h3>
            <button 
              className="text-gray-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Screenshot preview */}
          {screenshot ? (
            <div className="mb-4">
              <div className="relative rounded-lg overflow-hidden border border-white/10">
                <img src={screenshot} alt="Map screenshot" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-3">
                  <span className="text-white text-xs">Current Map View</span>
                </div>
              </div>
            </div>
          ) : (
            <button 
              className="w-full bg-background/40 hover:bg-background/60 py-2 rounded-lg mb-4 flex items-center justify-center text-sm"
              onClick={takeScreenshot}
            >
              <Camera className="w-4 h-4 mr-1.5" />
              Capture Current View
            </button>
          )}
          
          {/* Share URL */}
          <div className="relative mb-4">
            <input 
              type="text" 
              value={generateShareURL()} 
              readOnly
              className="w-full px-3 py-2 bg-background/40 rounded-lg text-sm text-gray-300 pr-10"
            />
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={copyToClipboard}
              aria-label="Copy URL"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Social share buttons */}
          <div className="flex justify-around">
            <button 
              className="flex flex-col items-center p-2 rounded-lg hover:bg-background/40"
              onClick={() => shareOnPlatform('twitter')}
              aria-label="Share on Twitter"
            >
              <div className="w-8 h-8 rounded-full bg-[#1DA1F2]/20 flex items-center justify-center mb-1">
                <Twitter className="w-4 h-4 text-[#1DA1F2]" />
              </div>
              <span className="text-xs">Twitter</span>
            </button>
            
            <button 
              className="flex flex-col items-center p-2 rounded-lg hover:bg-background/40"
              onClick={() => shareOnPlatform('facebook')}
              aria-label="Share on Facebook"
            >
              <div className="w-8 h-8 rounded-full bg-[#1877F2]/20 flex items-center justify-center mb-1">
                <Facebook className="w-4 h-4 text-[#1877F2]" />
              </div>
              <span className="text-xs">Facebook</span>
            </button>
            
            <button 
              className="flex flex-col items-center p-2 rounded-lg hover:bg-background/40"
              onClick={() => shareOnPlatform('linkedin')}
              aria-label="Share on LinkedIn"
            >
              <div className="w-8 h-8 rounded-full bg-[#0A66C2]/20 flex items-center justify-center mb-1">
                <Linkedin className="w-4 h-4 text-[#0A66C2]" />
              </div>
              <span className="text-xs">LinkedIn</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialShare;
