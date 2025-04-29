import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fetchBuildOrder, fetchBuildOrderEntries } from '@/api/buildOrders';
import { BuildOrder, BuildOrderEntry } from '@shared/schema';
import EditBuildOrderDialog from './EditBuildOrderDialog';
import { GreekCornerDecoration } from "@/assets/cornerDecorations";

const BuildOrderView: React.FC = () => {
  const [buildOrder, setBuildOrder] = useState<BuildOrder | null>(null);
  const [entries, setEntries] = useState<BuildOrderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
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

  const handleEditSuccess = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [updatedBuildOrder, updatedEntries] = await Promise.all([
        fetchBuildOrder(id),
        fetchBuildOrderEntries(id)
      ]);

      setBuildOrder(updatedBuildOrder);
      setEntries(updatedEntries);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    goBack();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-sandy-gold">Loading build order details...</div>
      </div>
    );
  }

  if (error || !buildOrder) {
    return (
      <div className="bg-parchment p-6 rounded-lg border-2 border-sandy-gold">
        <div className="text-sandy-gold mb-4">{error || 'Build order not found'}</div>
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
    <div className="bg-parchment bg-opacity-60 rounded-lg shadow-lg p-6 border-2 border-sandy-gold relative overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-16 h-16 text-earthy-light opacity-40">
        <GreekCornerDecoration />
      </div>
      <div className="absolute top-0 right-0 w-16 h-16 text-earthy-light opacity-40 transform rotate-90">
        <GreekCornerDecoration />
      </div>
      <div className="absolute bottom-0 left-0 w-16 h-16 text-earthy-light opacity-40 transform -rotate-90">
        <GreekCornerDecoration />
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16 text-earthy-light opacity-40 transform rotate-180">
        <GreekCornerDecoration />
      </div>

      <div className="flex flex-col items-center relative z-10 px-20">
        <div className="flex flex-col bg-sandy-gold/20 rounded-lg p-3 shadow-md border border-sandy-gold mb-3">
          <div className="text-sandy-gold text-lg font-medium text-center">
            {buildOrder.civilization} - {buildOrder.god}
          </div>
          <div className="text-sandy-gold/80 text-base mt-1 text-center">
            {buildOrder.type}
          </div>
        </div>

        <div className="mb-3 relative z-10 max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-cinzel text-sandy-gold font-bold mb-2">
            {buildOrder.name}
          </h1>
          <p className="text-sandy-gold">
            {buildOrder.description}
          </p>
        </div>

        <div className="flex w-full justify-between mb-6">
          <Button 
            onClick={goBack}
            className="bg-sandy-gold hover:bg-sandy-dark text-parchment-light px-6 h-10"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>

          <Button
            onClick={() => setEditDialogOpen(true)}
            className="bg-accent-gold hover:bg-accent-dark text-parchment-light px-6 h-10"
          >
            <Edit className="h-5 w-5 mr-2" />
            Edit
          </Button>
        </div>
          </div>

      {/* Table section */}
      <div className="overflow-hidden rounded-lg border-2 border-sandy-gold relative z-10 max-w-4xl mx-auto mt-2">
        <table className="w-full divide-y-2 divide-sandy-gold/30">
          <thead className="bg-sandy-gold">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-cinzel">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-cinzel">
                Main Action
              </th>
              <th className="w-12 px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider font-cinzel">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-parchment-light divide-y divide-sandy-gold/20">
            {entries.map((entry) => (
              <React.Fragment key={entry.id}>
                <tr className="hover:bg-sandy-gold/5">
                  <td className="px-3 py-0.5 align-middle whitespace-nowrap text-base font-medium text-sandy-light">
                    {entry.sequence}
                  </td>
                  <td className="px-3 py-0.5 align-middle text-base text-sandy-light font-bold break-words">
                    <div className="max-w-[400px]">{entry.mainAction}</div>
                  </td>
                  <td className="px-3 py-0.5 align-middle whitespace-nowrap text-base text-sandy-light">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {entry.villagerCount && (
                          <span className="mr-2">👥 {entry.villagerCount}</span>
                        )}
                        {entry.population && (
                          <span>Pop: {entry.population}</span>
                        )}
                        {entry.notes && (
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-sandy-light hover:text-sandy-gold transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-sandy-gold text-parchment-light">
                              {entry.notes}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center">
                          <div className="w-[32px] h-[32px] relative">
                            <img src="/images/food.png" alt="Food" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-base font-bold leading-none">0</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-[32px] h-[32px] relative">
                            <img src="/images/wood.png" alt="Wood" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-base font-bold leading-none">0</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-[32px] h-[32px] relative">
                            <img src="/images/gold.png" alt="Gold" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-base font-bold leading-none">0</span>
                        </div>
                      </div>
                  </td>
                </tr>
                {entry.miscellaneousAction && (
                  <tr className="bg-sandy-gold/10">
                    <td className="px-5 py-1 text-base text-sandy-light/70"></td>
                    <td colSpan={2} className="px-5 py-1 text-base text-sandy-light font-medium italic">
                      {entry.miscellaneousAction}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Build Order Dialog */}
      {id && (
        <EditBuildOrderDialog
          buildOrderId={id}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={handleEditSuccess}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default BuildOrderView;