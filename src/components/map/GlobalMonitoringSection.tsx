
import React from 'react';
import { Trash2 } from 'lucide-react';
import MapPreview from '../MapPreview';

const GlobalMonitoringSection = () => {
  return (
    <section className="py-20 px-4 bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <span className="badge">
              <Trash2 className="w-3 h-3 mr-1" />
              <span>Waste Hotspots</span>
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Global Monitoring System</h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8">
            Visualize marine waste hotspots across the globe with our interactive map interface.
          </p>
        </div>
        
        <MapPreview />
      </div>
    </section>
  );
};

export default GlobalMonitoringSection;
