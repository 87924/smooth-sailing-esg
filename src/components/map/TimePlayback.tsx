
import { useState, useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { motion } from "framer-motion";
import { Calendar, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import * as L from "leaflet";

interface TimePlaybackProps {
  onTimeChange: (timestamp: string) => void;
}

const TimePlayback = ({ onTimeChange }: TimePlaybackProps) => {
  const map = useMap();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [timeControl, setTimeControl] = useState<L.Control | null>(null);
  
  const timePoints = [
    { date: '2022-01', label: 'Jan 2022' },
    { date: '2022-04', label: 'Apr 2022' },
    { date: '2022-07', label: 'Jul 2022' },
    { date: '2022-10', label: 'Oct 2022' },
    { date: '2023-01', label: 'Jan 2023' },
    { date: '2023-04', label: 'Apr 2023' },
    { date: '2023-07', label: 'Jul 2023' },
    { date: '2023-10', label: 'Oct 2023' },
    { date: '2024-01', label: 'Jan 2024' },
    { date: '2024-04', label: 'Apr 2024' }
  ];
  
  const [currentTimeIndex, setCurrentTimeIndex] = useState(timePoints.length - 1);
  
  useEffect(() => {
    if (!map) return;
    
    // Only add control if it doesn't exist yet
    if (!timeControl) {
      const control = L.Control.extend({
        options: {
          position: 'bottomright'
        },
        
        onAdd: function() {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
          container.innerHTML = `
            <button 
              class="bg-card/80 backdrop-blur-sm hover:bg-card/90 p-2 flex items-center justify-center rounded-md shadow-md"
              title="Time Playback"
            >
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </span>
            </button>
          `;
          
          L.DomEvent.on(container.querySelector('button'), 'click', function() {
            setIsOpen(prev => !prev);
          });
          
          return container;
        }
      });
      
      const newControl = new control();
      map.addControl(newControl);
      setTimeControl(newControl);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (timeControl) {
        map.removeControl(timeControl);
      }
    };
  }, [map]);
  
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTimeIndex(prev => {
          const newIndex = (prev + 1) % timePoints.length;
          onTimeChange(timePoints[newIndex].date);
          return newIndex;
        });
      }, 2000 / playbackSpeed);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isPlaying, playbackSpeed, onTimeChange, timePoints]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast({
        title: "Time Playback Started",
        description: `Showing waste accumulation over time`,
      });
    }
  };
  
  const handleNext = () => {
    setCurrentTimeIndex(prev => {
      const newIndex = (prev + 1) % timePoints.length;
      onTimeChange(timePoints[newIndex].date);
      return newIndex;
    });
  };
  
  const handlePrevious = () => {
    setCurrentTimeIndex(prev => {
      const newIndex = prev === 0 ? timePoints.length - 1 : prev - 1;
      onTimeChange(timePoints[newIndex].date);
      return newIndex;
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div 
      className="absolute right-4 bottom-16 bg-card/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/10 z-[500] w-64"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold flex items-center">
          <Calendar className="w-3 h-3 mr-1.5" />
          Time Playback
        </h3>
        <div className="text-xs bg-background/40 px-2 py-0.5 rounded-md">
          {timePoints[currentTimeIndex].label}
        </div>
      </div>
      
      <div className="relative h-2 bg-gray-700 rounded-full mb-2">
        <div 
          className="absolute h-full bg-ocean rounded-full" 
          style={{ width: `${(currentTimeIndex / (timePoints.length - 1)) * 100}%` }}
        />
        <div className="absolute top-0 left-0 right-0 flex justify-between">
          {timePoints.map((_, index) => (
            <div 
              key={index} 
              className={`w-1.5 h-1.5 rounded-full -mt-0.5 cursor-pointer ${index <= currentTimeIndex ? 'bg-ocean' : 'bg-gray-500'}`}
              onClick={() => {
                setCurrentTimeIndex(index);
                onTimeChange(timePoints[index].date);
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <button 
          className="bg-background/40 hover:bg-background/60 p-1 rounded-md"
          onClick={handlePrevious}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <button 
          className="bg-ocean/80 hover:bg-ocean text-white p-1.5 rounded-full"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
        
        <button 
          className="bg-background/40 hover:bg-background/60 p-1 rounded-md"
          onClick={handleNext}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        
        <select 
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          className="bg-background/40 text-xs p-1 rounded-md"
        >
          <option value="0.5">0.5x</option>
          <option value="1">1x</option>
          <option value="2">2x</option>
          <option value="4">4x</option>
        </select>
      </div>
    </motion.div>
  );
};

export default TimePlayback;
