
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="glass-container rounded-xl p-6 hover-card">
      <div className="w-12 h-12 mb-4 rounded-lg bg-ocean/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-ocean" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </div>
  );
};

export default FeatureCard;
