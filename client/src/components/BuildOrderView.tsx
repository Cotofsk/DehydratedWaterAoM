import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scroll, Edit } from 'lucide-react';
import { fetchBuildOrder, fetchBuildOrderEntries } from '@/api/buildOrders';
import { BuildOrder, BuildOrderEntry } from '@shared/schema';
import EditBuildOrderDialog from './EditBuildOrderDialog';

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

  // Refresh data after edit
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

  // Handle delete (navigate back to list)
  const handleDelete = () => {
    goBack();
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
    <div className="bg-wood-dark/90 p-6 rounded-lg border-2 border-sandy-gold/30">
      <div className="flex justify-between items-start mb-6">
        <Button 
          onClick={goBack}
          variant="outline"
          className="border-sandy-gold/30 hover:bg-sandy-gold/20 hover:text-sandy-gold hover:border-sandy-gold"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex flex-col bg-wood-dark rounded-lg p-3 shadow-md border border-sandy-gold/30">
            <div className="text-sandy-gold text-lg font-medium">
              {buildOrder.civilization} - {buildOrder.god}
            </div>
            <div className="text-sandy-gold/80 text-base mt-1">
              {buildOrder.type}
            </div>
          </div>

          <Button
            onClick={() => setEditDialogOpen(true)}
            className="bg-sandy-gold/20 hover:bg-sandy-gold/30 text-sandy-gold border border-sandy-gold/30 h-full px-6 text-lg"
          >
            <Edit className="h-5 w-5 mr-2" />
            Edit
          </Button>
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
        <div className="overflow-hidden rounded-lg border border-sandy-gold/30">
          <table className="min-w-full divide-y divide-sandy-gold/30">
            <thead className="bg-wood-dark/90">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-sandy-gold uppercase tracking-wider font-cinzel">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-sandy-gold uppercase tracking-wider font-cinzel">
                  Main Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-sandy-gold uppercase tracking-wider font-cinzel">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-wood-dark/80 divide-y divide-sandy-gold/30">
              {entries.map((entry) => (
                <React.Fragment key={entry.id}>
                  <tr className="hover:bg-wood-dark/95">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-sandy-gold">
                      {entry.sequence}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-sandy-gold/90 font-bold">
                      {entry.mainAction}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-sandy-gold/80">
                      {entry.villagerCount && (
                        <span className="mr-2">👥 {entry.villagerCount}</span>
                      )}
                      {entry.population && (
                        <span>Pop: {entry.population}</span>
                      )}
                    </td>
                  </tr>
                  {entry.miscellaneousAction && (
                    <tr className="bg-wood-dark/70">
                      <td className="px-4 py-2 text-sm text-sandy-gold/60"></td>
                      <td colSpan={2} className="px-4 py-2 text-sm text-sandy-gold/60 italic">
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