
import React from 'react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold">
              E
            </div>
            <a href="/" className="text-xl font-bold text-white">ESG First</a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/features" className="nav-link">Features</a>
            <a href="/solutions" className="nav-link">Solutions</a>
            <a href="/pricing" className="nav-link">Pricing</a>
            <Button className="button-gradient px-8">Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
