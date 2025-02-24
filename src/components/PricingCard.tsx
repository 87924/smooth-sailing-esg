
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
}

const PricingCard = ({ title, price, description, features }: PricingCardProps) => {
  return (
    <div className="glass p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-muted-foreground">/month</span>
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Button className="button-gradient w-full mb-8">Get Started</Button>
      <div className="space-y-4">
        <h4 className="font-semibold">Features</h4>
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCard;
