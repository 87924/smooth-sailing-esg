
import React from 'react';
import Hero from '../components/Hero';
import FeaturesSection from '../components/features/FeaturesSection';
import DashboardPreview from '../components/dashboard/DashboardPreview';
import GlobalMonitoringSection from '../components/map/GlobalMonitoringSection';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Dashboard Preview */}
      <DashboardPreview />
      
      {/* Map Preview */}
      <GlobalMonitoringSection />
    </div>
  );
};

export default Index;
