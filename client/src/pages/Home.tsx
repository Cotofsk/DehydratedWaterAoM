import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Tabs from "@/components/Tabs";
import BuildOrdersTab from "@/components/BuildOrdersTab";
import EmptyTabContent from "@/components/EmptyTabContent";
import { 
  GreekCornerDecoration, 
  MythologyCornerDecoration, 
  LaurelWreathCorner, 
  AncientSymbolCorner 
} from "@/assets/cornerDecorations";

// Tab types
type TabId = 'build-orders' | 'strategies' | 'units' | 'civilizations' | 'deities';

const Home = () => {
  const [activeTab, setActiveTab] = useState<TabId>('build-orders');

  const tabs = [
    { id: 'build-orders', label: 'Build Orders' },
    { id: 'strategies', label: 'Strategies' },
    { id: 'units', label: 'Units' },
    { id: 'civilizations', label: 'Civilizations' },
    { id: 'deities', label: 'Deities' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Header title="Ancient Strategy Chronicles" />
      
      <Tabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={(id) => setActiveTab(id as TabId)} 
      />
      
      <main className="bg-parchment bg-opacity-60 rounded-lg shadow-lg p-4 md:p-6 border-2 border-sandy-gold relative overflow-hidden">
        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-16 h-16 text-earthy-light opacity-40">
          <GreekCornerDecoration />
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 text-earthy-light opacity-40 transform rotate-90">
          <MythologyCornerDecoration />
        </div>
        <div className="absolute bottom-0 left-0 w-16 h-16 text-earthy-light opacity-40 transform -rotate-90">
          <LaurelWreathCorner />
        </div>
        <div className="absolute bottom-0 right-0 w-16 h-16 text-earthy-light opacity-40 transform rotate-180">
          <AncientSymbolCorner />
        </div>
        
        {/* Tab Content */}
        {activeTab === 'build-orders' && <BuildOrdersTab />}
        {activeTab === 'strategies' && (
          <EmptyTabContent 
            icon="scroll" 
            title="Strategies Content" 
            description="This section will contain various strategic approaches for different scenarios. Content is being inscribed on sacred scrolls..."
          />
        )}
        {activeTab === 'units' && (
          <EmptyTabContent 
            icon="shield" 
            title="Units Content" 
            description="Here you will find detailed information about various units. The ancient records are being restored..."
          />
        )}
        {activeTab === 'civilizations' && (
          <EmptyTabContent 
            icon="landmark" 
            title="Civilizations Content" 
            description="Learn about the mighty civilizations of the ancient world. Historical texts are being translated..."
          />
        )}
        {activeTab === 'deities' && (
          <EmptyTabContent 
            icon="bolt" 
            title="Deities Content" 
            description="Discover the power of ancient deities and their divine interventions. Divine revelations are forthcoming..."
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
