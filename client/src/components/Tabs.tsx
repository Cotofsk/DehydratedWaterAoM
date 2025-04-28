import React from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="mb-10 overflow-x-auto pb-2 scroll-design">
      <div className="flex space-x-1 md:space-x-4 min-w-max border-b-2 border-sandy-gold">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "px-4 py-3 rounded-t-lg font-cinzel font-semibold relative min-w-[140px] transition-all duration-300 tab-hover",
              activeTab === tab.id 
                ? "tab-active" 
                : "opacity-80"
            )}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            <div className={cn(
              "absolute bottom-0 left-0 right-0 h-1",
              activeTab === tab.id ? "bg-accent-gold" : "bg-transparent"
            )}></div>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Tabs;
