
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Waves, Shield, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      const moveX = (x - 0.5) * 20;
      const moveY = (y - 0.5) * 20;
      
      const layers = heroRef.current.querySelectorAll('.parallax-layer');
      layers.forEach((layer, index) => {
        const speed = 1 + index * 0.5;
        const htmlLayer = layer as HTMLElement;
        htmlLayer.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden wave-bg" ref={heroRef}>
      {/* Moving gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-ocean-950/40 to-background/95 z-0"></div>
      
      {/* Parallax floating elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-ocean/5 blur-3xl parallax-layer"></div>
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-ocean/10 blur-2xl parallax-layer"></div>
      <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-ocean/10 blur-xl parallax-layer"></div>
      
      <div className="container mx-auto px-4 pt-20 z-10">
        <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
          <div className="w-full md:w-1/2 md:pr-8 mb-10 md:mb-0">
            {/* Badge */}
            <div className="mb-6 inline-block animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <span className="badge">
                <Waves className="w-3 h-3 mr-1" />
                <span>Ocean Protection Initiative</span>
              </span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <span className="ocean-text">Sea Trash</span> Detection & Analytics Hub
            </h1>
            
            {/* Description */}
            <p className="text-lg text-foreground/80 mb-8 max-w-xl animate-fade-in" style={{ animationDelay: '0.6s' }}>
              Leveraging AI to monitor and combat marine pollution in real-time. 
              Dive into comprehensive analytics and visualizations of ocean waste data.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <Link to="/dashboard" className="glass-button ripple flex items-center group">
                <span>Explore Dashboard</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/about" className="px-4 py-2 rounded-lg border border-white/10 text-foreground/70 transition-all duration-300 hover:bg-white/5 hover:text-foreground active:scale-95">
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 relative animate-fade-in" style={{ animationDelay: '1s' }}>
            {/* Hero image with animation */}
            <div className="relative animated-border rounded-lg overflow-hidden aspect-video">
              <div className="absolute inset-0 bg-gradient-to-br from-ocean-900/60 to-background/60 z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?q=80&w=1000&auto=format&fit=crop"
                alt="Ocean with waste visualization" 
                className="w-full h-full object-cover"
              />
              
              {/* Floating stats widgets */}
              <div className="absolute top-6 left-6 glass-container p-3 rounded-lg z-20 flex items-center space-x-3 animate-float">
                <div className="p-2 rounded-lg bg-ocean/20">
                  <Shield className="w-5 h-5 text-ocean-300" />
                </div>
                <div>
                  <div className="text-xs text-foreground/70">Protection Rate</div>
                  <div className="text-sm font-semibold">87% Coverage</div>
                </div>
              </div>
              
              <div className="absolute bottom-6 right-6 glass-container p-3 rounded-lg z-20 flex items-center space-x-3 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="p-2 rounded-lg bg-ocean/20">
                  <BarChart2 className="w-5 h-5 text-ocean-300" />
                </div>
                <div>
                  <div className="text-xs text-foreground/70">Waste Detected</div>
                  <div className="text-sm font-semibold">+2,580 tons</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
