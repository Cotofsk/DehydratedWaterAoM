import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scroll } from 'lucide-react';
import { fetchBuildOrder, fetchBuildOrderEntries } from '@/api/buildOrders';
import { BuildOrder, BuildOrderEntry } from '@shared/schema';

const BuildOrderView: React.FC = () => {
  const [buildOrder, setBuildOrder] = useState<BuildOrder | null>(null);
  const [entries, setEntries] = useState<BuildOrderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  
  const id = params?.id ? parseInt(params.id) : undefined;
  
  useEffect(() => {
    async function loadBuildOrder() {
      if (!id) return;
      
      try {
        setLoading(true);
        const buildOrderData = await fetchBuildOrder(id);
        const entriesData = await fetchBuildOrderEntries(id);
        
        setBuildOrder(buildOrderData);
        setEntries(entriesData);
        setError(null);
      } catch (err) {
        console.error('Error loading build order:', err);
        setError('Failed to load build order. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    loadBuildOrder();
  }, [id]);
  
  const goBack = () => {
    setLocation('/');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-earthy-dark">Loading build order details...</div>
      </div>
    );
  }
  
  if (error || !buildOrder) {
    return (
      <div className="bg-parchment-light p-6 rounded-lg border-2 border-sandy-gold">
        <div className="text-earthy-dark mb-4">{error || 'Build order not found'}</div>
        <Button 
          onClick={goBack}
          className="bg-sandy-gold hover:bg-sandy-dark text-parchment-light"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Build Orders
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-parchment-light p-6 rounded-lg border-2 border-sandy-gold">
      <div className="flex justify-between items-start mb-6">
        <Button 
          onClick={goBack}
          variant="outline"
          className="border-sandy-gold hover:bg-sandy-gold hover:text-parchment-light"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="flex flex-col items-end">
          <div className="bg-earthy-brown text-parchment-light px-3 py-1 rounded-md text-sm">
            {buildOrder.civilization} - {buildOrder.god}
          </div>
          <div className="text-earthy-light text-sm mt-1">
            {buildOrder.type}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-cinzel text-earthy-dark font-bold mb-2">
          {buildOrder.name}
        </h1>
        <p className="text-earthy-brown">
          {buildOrder.description}
        </p>
      </div>
      
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-earthy-light">
          <Scroll className="h-10 w-10 mb-4 opacity-40" />
          <p>No steps have been added to this build order yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-sandy-gold">
          <table className="min-w-full divide-y divide-sandy-gold">
            <thead className="bg-earthy-brown">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-parchment-light uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-parchment-light uppercase tracking-wider">
                  Main Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-parchment-light uppercase tracking-wider">
                  Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-parchment-light uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-parchment-light uppercase tracking-wider">
                  Age
                </th>
              </tr>
            </thead>
            <tbody className="bg-parchment-light divide-y divide-sandy-gold">
              {entries.map((entry) => (
                <React.Fragment key={entry.id}>
                  <tr className="hover:bg-parchment-dark">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-earthy-dark">
                      {entry.sequence}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-earthy-dark font-semibold">
                      {entry.mainAction}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-earthy-dark">
                      {entry.villagerCount && (
                        <span className="mr-2">👥 {entry.villagerCount}</span>
                      )}
                      {entry.population && (
                        <span>Pop: {entry.population}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-earthy-dark">
                      {entry.timeStamp}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-earthy-dark">
                      {entry.agePhase}
                    </td>
                  </tr>
                  {entry.miscellaneousAction && (
                    <tr className="bg-parchment bg-opacity-40">
                      <td className="px-4 py-2 text-sm text-earthy-light"></td>
                      <td colSpan={4} className="px-4 py-2 text-sm text-earthy-light italic">
                        {entry.miscellaneousAction}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BuildOrderView;