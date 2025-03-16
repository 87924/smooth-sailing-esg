
import React from 'react';
import { BarChart2, BarChart3 } from 'lucide-react';

const DashboardPreview = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2">
            <div className="inline-block mb-4">
              <span className="badge">
                <BarChart2 className="w-3 h-3 mr-1" />
                <span>Waste Analytics</span>
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Comprehensive Dashboard</h2>
            <p className="text-foreground/70 mb-6">
              Monitor key metrics and trends with our interactive dashboard. Track waste detection
              rates, geographic distribution, and temporal patterns to gain actionable insights.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                'Real-time detection metrics and statistics',
                'Interactive data visualization and filtering',
                'Temporal analysis of waste accumulation patterns',
                'Customizable alerts and monitoring thresholds'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-ocean mr-2">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <a href="/dashboard" className="glass-button ripple inline-flex items-center">
              <span>Explore Dashboard</span>
              <BarChart3 className="ml-2 w-4 h-4" />
            </a>
          </div>
          
          <div className="w-full md:w-1/2 animated-border rounded-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000"
              alt="Dashboard preview" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
