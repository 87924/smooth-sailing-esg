
import React from 'react';
import Navbar from '@/components/Navbar';
import PricingCard from '@/components/PricingCard';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import HeroBackground from '@/components/HeroBackground';

const Index = () => {
  const pricingPlans = [
    {
      title: "Starter Plan",
      price: "1,500",
      description: "Ideal for individuals or small businesses starting their ESG journey.",
      features: [
        "Basic ESG Reporting",
        "Carbon Footprint Calculator",
        "Monthly ESG Updates",
        "Basic Analytics Dashboard",
        "Email Support"
      ]
    },
    {
      title: "Premium Plan",
      price: "2,000",
      description: "Perfect for growing businesses requiring comprehensive ESG solutions.",
      features: [
        "Advanced ESG Reporting",
        "Real-time Carbon Tracking",
        "Weekly ESG Updates",
        "Advanced Analytics",
        "Priority Support"
      ]
    },
    {
      title: "Enterprise Plan",
      price: "5,000",
      description: "Complete solution for large organizations seeking full ESG integration.",
      features: [
        "Custom ESG Framework",
        "Supply Chain ESG Tracking",
        "Daily Updates & Alerts",
        "AI-Powered Insights",
        "24/7 Dedicated Support"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 text-center relative overflow-hidden">
        <HeroBackground />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sustainable Solutions for
            <span className="gradient-text block mt-2">your diverse needs</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Transform your business with our comprehensive ESG solutions. Make informed decisions that benefit both your bottom line and our planet.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="button-gradient px-8 py-6">Get Started</Button>
            <Button variant="outline" className="px-8 py-6">Learn More</Button>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 gradient-text">Comprehensive Analysis</h3>
              <p className="text-muted-foreground">
                Our advanced ESG analytics provide deep insights into your organization's environmental impact, social responsibility, and governance practices.
              </p>
            </div>
            <div className="p-6 rounded-lg backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 gradient-text">Real-time Monitoring</h3>
              <p className="text-muted-foreground">
                Stay ahead with real-time monitoring of your ESG metrics, ensuring compliance and identifying opportunities for improvement.
              </p>
            </div>
            <div className="p-6 rounded-lg backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 gradient-text">Expert Support</h3>
              <p className="text-muted-foreground">
                Our team of ESG experts provides dedicated support to help you navigate complex sustainability challenges and achieve your goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Transparent Pricing</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Choose the perfect plan that aligns with your organization's ESG goals and requirements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
