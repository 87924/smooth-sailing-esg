import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PricingCard from '@/components/PricingCard';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import HeroBackground from '@/components/HeroBackground';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Index = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      mirror: false,
      easing: 'ease-out-cubic',
      disable: 'mobile'
    });
  }, []);

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
      
      <section className="pt-32 pb-20 text-center relative overflow-hidden">
        <HeroBackground />
        <div className="container mx-auto px-4 relative z-10" data-aos="fade-up" data-aos-duration="1000">
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
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
      </section>

      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300" 
              data-aos="fade-up">
              <h3 className="text-2xl font-bold mb-4 gradient-text">Comprehensive Analysis</h3>
              <p className="text-muted-foreground">
                Our advanced ESG analytics provide deep insights into your organization's environmental impact, social responsibility, and governance practices.
              </p>
            </div>
            <div className="p-6 rounded-lg backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300" 
              data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-2xl font-bold mb-4 gradient-text">Real-time Monitoring</h3>
              <p className="text-muted-foreground">
                Stay ahead with real-time monitoring of your ESG metrics, ensuring compliance and identifying opportunities for improvement.
              </p>
            </div>
            <div className="p-6 rounded-lg backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300" 
              data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-2xl font-bold mb-4 gradient-text">Expert Support</h3>
              <p className="text-muted-foreground">
                Our team of ESG experts provides dedicated support to help you navigate complex sustainability challenges and achieve your goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1" data-aos="fade-right">
              <h2 className="text-3xl font-bold mb-4">Collaborative Solutions</h2>
              <p className="text-muted-foreground mb-6">
                Work together with your team to implement effective ESG strategies. Our platform enables seamless collaboration and real-time updates for better decision-making.
              </p>
              <Button variant="outline">Learn More</Button>
            </div>
            <div className="flex-1" data-aos="fade-left" data-aos-delay="200">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
                alt="Team Collaboration" 
                className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12">
            <div className="flex-1" data-aos="fade-right">
              <img 
                src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" 
                alt="Advanced Analytics" 
                className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex-1" data-aos="fade-left" data-aos-delay="200">
              <h2 className="text-3xl font-bold mb-4">Advanced Analytics</h2>
              <p className="text-muted-foreground mb-6">
                Leverage our powerful analytics tools to gain insights into your ESG performance. Track metrics, analyze trends, and make data-driven decisions.
              </p>
              <Button variant="outline">Explore Analytics</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1" data-aos="fade-right">
              <h2 className="text-3xl font-bold mb-4">Personal Support</h2>
              <p className="text-muted-foreground mb-6">
                Get dedicated support from our team of ESG experts. We're here to help you navigate challenges and achieve your sustainability goals.
              </p>
              <Button variant="outline">Contact Us</Button>
            </div>
            <div className="flex-1" data-aos="fade-left" data-aos-delay="200">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                alt="Expert Support" 
                className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12">
            <div className="flex-1" data-aos="fade-right">
              <img 
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
                alt="Data Visualization" 
                className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex-1" data-aos="fade-left" data-aos-delay="200">
              <h2 className="text-3xl font-bold mb-4">Real-time Insights</h2>
              <p className="text-muted-foreground mb-6">
                Monitor your ESG metrics in real-time with our advanced visualization tools. Stay informed and make timely decisions based on the latest data.
              </p>
              <Button variant="outline">View Demo</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" data-aos="fade-up">Transparent Pricing</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12" data-aos="fade-up" data-aos-delay="100">
            Choose the perfect plan that aligns with your organization's ESG goals and requirements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={100 * index}>
                <PricingCard {...plan} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
