import React from "react";
import { ScrollText, Shield, Landmark, Bolt } from "lucide-react";

interface EmptyTabContentProps {
  icon: "scroll" | "shield" | "landmark" | "bolt";
  title: string;
  description: string;
}

const EmptyTabContent: React.FC<EmptyTabContentProps> = ({ icon, title, description }) => {
  const renderIcon = () => {
    switch (icon) {
      case "scroll":
        return <ScrollText className="w-16 h-16" />;
      case "shield":
        return <Shield className="w-16 h-16" />;
      case "landmark":
        return <Landmark className="w-16 h-16" />;
      case "bolt":
        return <Bolt className="w-16 h-16" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="text-center max-w-lg">
        <div className="text-earthy-light mb-4 flex justify-center">
          {renderIcon()}
        </div>
        <h3 className="text-2xl font-cinzel font-bold mb-4">{title}</h3>
        <p className="text-earthy-brown">{description}</p>
      </div>
    </div>
  );
};

export default EmptyTabContent;
