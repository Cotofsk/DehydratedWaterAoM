
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
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

      <div className="flex justify-between items-start mb-6 relative z-10">
        <Button 
          onClick={goBack}
          className="bg-sandy-gold hover:bg-sandy-dark text-parchment-light"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex flex-col bg-sandy-gold/20 rounded-lg p-3 shadow-md border border-sandy-gold">
            <div className="text-sandy-gold text-lg font-medium">
              {buildOrder.civilization} - {buildOrder.god}
            </div>
            <div className="text-sandy-gold/80 text-base mt-1">
              {buildOrder.type}
            </div>
          </div>

          <Button
            onClick={() => setEditDialogOpen(true)}
            className="bg-accent-gold hover:bg-accent-dark text-parchment-light h-full px-6 text-lg"
          >
            <Edit className="h-5 w-5 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="mb-6 relative z-10">
        <h1 className="text-2xl font-cinzel text-sandy-gold font-bold mb-2">
          {buildOrder.name}
        </h1>
        <p className="text-sandy-gold">
          {buildOrder.description}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border-2 border-sandy-gold relative z-10">
        <table className="min-w-full divide-y-2 divide-sandy-gold/30">
          <thead className="bg-sandy-gold">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-parchment-light uppercase tracking-wider font-cinzel">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-parchment-light uppercase tracking-wider font-cinzel">
                Main Action
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-parchment-light uppercase tracking-wider font-cinzel">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-parchment-light divide-y divide-sandy-gold/20">
            {entries.map((entry) => (
              <React.Fragment key={entry.id}>
                <tr className="hover:bg-sandy-gold/5">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-sandy-gold/90">
                    {entry.sequence}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-sandy-gold/90 font-bold">
                    {entry.mainAction}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-sandy-gold/90">
                    {entry.villagerCount && (
                      <span className="mr-2">👥 {entry.villagerCount}</span>
                    )}
                    {entry.population && (
                      <span>Pop: {entry.population}</span>
                    )}
                  </td>
                </tr>
                {entry.miscellaneousAction && (
                  <tr className="bg-sandy-gold/10">
                    <td className="px-4 py-2 text-sm text-sandy-gold/70"></td>
                    <td colSpan={2} className="px-4 py-2 text-sm text-sandy-gold font-medium italic">
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
