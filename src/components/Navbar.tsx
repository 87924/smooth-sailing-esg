
import React from 'react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold gradient-text">ESG First</a>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a href="/features" className="nav-link">Features</a>
            <a href="/solutions" className="nav-link">Solutions</a>
            <a href="/pricing" className="nav-link">Pricing</a>
            <Button className="button-gradient ml-4 px-6">Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
