
import React from 'react';
import { BarChart3, Map, Beaker, Database } from 'lucide-react';
import FeatureCard from '../FeatureCard';

const FeaturesSection = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive metrics and visualizations to understand marine waste patterns.'
    },
    {
      icon: Map,
      title: 'Real-Time Mapping',
      description: 'Track waste hotspots with interactive, real-time geographical data.'
    },
    {
      icon: Beaker,
      title: 'AI Detection',
      description: 'Cutting-edge AI models for accurate identification of marine debris.'
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Robust storage and processing of large-scale environmental datasets.'
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-foreground/70 max-w-xl mx-auto">
            Our platform combines cutting-edge AI technology with powerful data visualization 
            to provide comprehensive marine waste monitoring and analysis.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${0.2 * index}s` }}>
              <FeatureCard 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
