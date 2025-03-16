
import React from 'react';
import { BarChart3, Map, Beaker, Database, BarChart2, Trash2 } from 'lucide-react';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import MapPreview from '../components/MapPreview';

const Index = () => {
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
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
      
      {/* Dashboard Preview */}
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
      
      {/* Map Preview */}
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
    </div>
  );
};

export default Index;
