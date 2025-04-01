
import React from 'react';
import { X, Trash2, AlertTriangle, AlertOctagon, DropletIcon } from 'lucide-react';

interface InfoTooltipProps {
  point: {
    lat: number;
    lng: number;
    type: string;
    intensity: number;
  };
  onClose: () => void;
}

// Utility to get severity label from intensity
const getSeverityLabel = (intensity: number): string => {
  if (intensity >= 4) return 'High';
  if (intensity >= 2) return 'Medium';
  return 'Low';
};

// Utility to get severity color from intensity
const getSeverityColor = (intensity: number): string => {
  if (intensity >= 4) return 'bg-rose-500';
  if (intensity >= 2) return 'bg-amber-500';
  return 'bg-emerald-500';
};

// Utility to format types to be more readable
const formatType = (type: string): string => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get icon based on waste type
const getWasteIcon = (type: string) => {
  switch (type) {
    case 'industrial_waste':
      return <AlertOctagon className="w-5 h-5 text-purple-500" />;
    case 'sewage_waste':
      return <DropletIcon className="w-5 h-5 text-brown-500" />;
    case 'fishing_gear':
      return <AlertTriangle className="w-5 h-5 text-green-500" />;
    default:
      return <Trash2 className="w-5 h-5 text-blue-500" />;
  }
};

const InfoTooltip: React.FC<InfoTooltipProps> = ({ point, onClose }) => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-xl max-w-xs w-full animate-scale-in">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            {getWasteIcon(point.type)}
            <h3 className="text-lg font-bold ml-2">{formatType(point.type)}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Severity:</span>
            <span className={`px-2 py-1 rounded-full text-xs text-white ${getSeverityColor(point.intensity)}`}>
              {getSeverityLabel(point.intensity)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Intensity:</span>
            <div className="flex space-x-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-4 rounded-sm ${
                    i < point.intensity 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Location:</span>
            <span className="text-sm font-mono">
              {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This waste point was detected via satellite imagery and verified by our AI model.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoTooltip;
