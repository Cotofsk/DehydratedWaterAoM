import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { queryClient } from '@/lib/queryClient';
import { 
  fetchBuildOrder, 
  fetchBuildOrderEntries, 
  updateBuildOrder, 
  deleteBuildOrder,
  createBuildOrderEntry,
  updateBuildOrderEntry,
  deleteBuildOrderEntry,
  reorderBuildOrderEntries
} from '@/api/buildOrders';
import { BuildOrder, BuildOrderEntry } from '@shared/schema';
import { godsByCivilization } from '@/data/buildOrders';

// General Info Schema
const generalInfoSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  civilization: z.string().min(1, { message: 'Civilization is required' }),
  god: z.string().min(1, { message: 'God is required' }),
  type: z.string().min(1, { message: 'Type is required' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
});

// Entry Creation Schema
const entrySchema = z.object({
  mainAction: z.string().min(3, { message: 'Main action is required' }),
  miscellaneousAction: z.string().optional(),
  notes: z.string().optional(),
  isComplete: z.boolean().default(false),
  food: z.number().default(0),
  wood: z.number().default(0),
  gold: z.number().default(0),
});

type GeneralInfoFormValues = z.infer<typeof generalInfoSchema>;
type EntryFormValues = z.infer<typeof entrySchema>;

interface EditBuildOrderDialogProps {
  buildOrderId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: () => void;
  onSuccess?: () => void;
}

const EditBuildOrderDialog: React.FC<EditBuildOrderDialogProps> = ({
  buildOrderId,
  open,
  onOpenChange,
  onDelete,
  onSuccess,
}) => {
  // State variables
  const [buildOrder, setBuildOrder] = useState<BuildOrder | null>(null);
  const [entries, setEntries] = useState<BuildOrderEntry[]>([]);
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  // General Info Form
  const generalInfoForm = useForm<GeneralInfoFormValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      name: '',
      civilization: '',
      god: '',
      type: '',
      description: '',
    },
  });

  // New Entry Form
  const entryForm = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      mainAction: '',
      miscellaneousAction: '',
      notes: '',
      isComplete: false,
      food: 0,
      wood: 0,
      gold: 0,
    },
  });

  // Edit Entry Form
  const editEntryForm = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      mainAction: '',
      miscellaneousAction: '',
      notes: '',
      isComplete: false,
      food: 0,
      wood: 0,
      gold: 0,
    },
  });

  // Load build order data and entries
  useEffect(() => {
    const loadBuildOrderData = async () => {
      if (!buildOrderId || !open) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch build order and entries
        const buildOrderData = await fetchBuildOrder(buildOrderId);
        const entriesData = await fetchBuildOrderEntries(buildOrderId);

        setBuildOrder(buildOrderData);
        setEntries(entriesData);

        // Set form values
        generalInfoForm.reset({
          name: buildOrderData.name,
          civilization: buildOrderData.civilization,
          god: buildOrderData.god,
          type: buildOrderData.type,
          description: buildOrderData.description,
        });

      } catch (err) {
        console.error('Error loading build order data:', err);
        setError('Failed to load build order. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadBuildOrderData();
  }, [buildOrderId, open, generalInfoForm]);

  // Reset state when the dialog is closed
  useEffect(() => {
    if (!open) {
      setActiveTab('general');
      setConfirmDelete(false);
      setSelectedEntryId(null);
      setError(null);
    }
  }, [open]);

  // Load selected entry into edit form
  useEffect(() => {
    if (selectedEntryId) {
      const selectedEntry = entries.find(entry => entry.id === selectedEntryId);
      if (selectedEntry) {
        editEntryForm.reset({
          mainAction: selectedEntry.mainAction,
          miscellaneousAction: selectedEntry.miscellaneousAction || '',
          notes: selectedEntry.notes || '',
          isComplete: selectedEntry.isComplete || false,
          food: selectedEntry.food || 0,
          wood: selectedEntry.wood || 0,
          gold: selectedEntry.gold || 0,
        });
      }
    }
  }, [selectedEntryId, entries, editEntryForm]);

  // Handle general info save
  const onSaveGeneralInfo = async (data: GeneralInfoFormValues) => {
    if (!buildOrderId || !buildOrder) return;

    try {
      setSaving(true);
      setError(null);

      await updateBuildOrder(buildOrderId, data);

      toast({
        title: 'Build order updated',
        description: 'The build order information has been updated.',
      });

      // Refresh the build order
      const updatedBuildOrder = await fetchBuildOrder(buildOrderId);
      setBuildOrder(updatedBuildOrder);

      // Refetch build orders list 
      queryClient.invalidateQueries({ queryKey: ['/api/build-orders'] });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error updating build order:', err);
      setError('Failed to update build order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle create entry
  const onCreateEntry = async (data: EntryFormValues) => {
    if (!buildOrderId) return;

    try {
      setSaving(true);
      setError(null);

      // Get the next sequence number
      const nextSequence = entries.length > 0 
        ? Math.max(...entries.map(e => e.sequence)) + 1 
        : 1;

      // Create new entry with sequence
      await createBuildOrderEntry(buildOrderId, {
        ...data,
        sequence: nextSequence
      });

      // Reset form
      entryForm.reset({
        mainAction: '',
        miscellaneousAction: '',
        notes: '',
        isComplete: false,
        food: 0,
        wood: 0,
        gold: 0,
      });

      // Refetch entries
      const updatedEntries = await fetchBuildOrderEntries(buildOrderId);
      setEntries(updatedEntries);
      setActiveTab('entries'); //Added
      toast({
        title: 'Entry added',
        description: 'A new entry has been added to the build order.',
      });
    } catch (err) {
      console.error('Error creating entry:', err);
      setError('Failed to add entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle update entry
  const onUpdateEntry = async (data: EntryFormValues) => {
    if (!selectedEntryId) return;

    try {
      setSaving(true);
      setError(null);

      // Update entry
      await updateBuildOrderEntry(selectedEntryId, data);

      // Reset selected entry
      setSelectedEntryId(null);

      // Refetch entries
      if (buildOrderId) {
        const updatedEntries = await fetchBuildOrderEntries(buildOrderId);
        setEntries(updatedEntries);
        setActiveTab('entries'); //Added
      }

      toast({
        title: 'Entry updated',
        description: 'The entry has been updated.',
      });
    } catch (err) {
      console.error('Error updating entry:', err);
      setError('Failed to update entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete entry
  const onDeleteEntry = async (entryId: number) => {
    try {
      setSaving(true);
      setError(null);

      // Delete entry
      await deleteBuildOrderEntry(entryId);

      // Refetch entries
      if (buildOrderId) {
        const updatedEntries = await fetchBuildOrderEntries(buildOrderId);
        setEntries(updatedEntries);
        setActiveTab('entries'); //Added
      }

      // If the deleted entry was selected, reset selection
      if (selectedEntryId === entryId) {
        setSelectedEntryId(null);
      }

      toast({
        title: 'Entry deleted',
        description: 'The entry has been removed from the build order.',
      });
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError('Failed to delete entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete build order
  const onDeleteBuildOrder = async () => {
    if (!buildOrderId) return;

    try {
      setDeleting(true);
      setError(null);

      await deleteBuildOrder(buildOrderId);

      toast({
        title: 'Build order deleted',
        description: 'The build order has been permanently deleted.',
      });

      // Refresh build orders list
      queryClient.invalidateQueries({ queryKey: ['/api/build-orders'] });

      // Close dialog
      onOpenChange(false);

      // Call onDelete callback
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      console.error('Error deleting build order:', err);
      setError('Failed to delete build order. Please try again.');
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  // Handle move entry up/down
  const moveEntry = async (entryId: number, direction: 'up' | 'down') => {
    if (!buildOrderId) return;

    const currentIndex = entries.findIndex(entry => entry.id === entryId);
    if (currentIndex === -1) return;

    // Can't move up if already at the top
    if (direction === 'up' && currentIndex === 0) return;

    // Can't move down if already at the bottom
    if (direction === 'down' && currentIndex === entries.length - 1) return;

    // Create a copy of entries and swap positions
    const newEntries = [...entries];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    // Swap the entries
    [newEntries[currentIndex], newEntries[newIndex]] = [newEntries[newIndex], newEntries[currentIndex]];

    // Get the IDs in the new order
    const newOrder = newEntries.map(entry => entry.id);

    try {
      setSaving(true);

      // Reorder entries on server
      await reorderBuildOrderEntries(buildOrderId, newOrder);

      // Update local state
      setEntries(newEntries);

      toast({
        title: 'Build order updated',
        description: 'Entry order has been updated.',
      });
    } catch (err) {
      console.error('Error reordering entries:', err);
      setError('Failed to reorder entries. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // If no build order selected, show nothing
  if (!buildOrderId && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-parchment sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <p className="text-earthy-dark">No build order selected for editing.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-parchment sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-cinzel text-earthy-dark">
            Edit Build Order
          </DialogTitle>
          <DialogDescription className="text-earthy-brown">
            Make changes to your build order and its steps.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center p-6">
            <p className="text-earthy-dark">Loading build order...</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-parchment-dark mb-4">
              <TabsTrigger value="general" className="flex-1">General Info</TabsTrigger>
              <TabsTrigger value="entries" className="flex-1">Entries</TabsTrigger>
              <TabsTrigger value="new-entry" className="flex-1">Add Entry</TabsTrigger>
              {selectedEntryId && (
                <TabsTrigger value="edit-entry" className="flex-1">Edit Entry</TabsTrigger>
              )}
            </TabsList>

            {/* General Info Tab */}
            <TabsContent value="general" className="mt-0">
              <Form {...generalInfoForm}>
                <form onSubmit={generalInfoForm.handleSubmit(onSaveGeneralInfo)} className="space-y-4">
                  <FormField
                    control={generalInfoForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Build Order Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            autoComplete="off"
                            className="bg-parchment-light border-2 border-sandy-gold" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={generalInfoForm.control}
                      name="civilization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Civilization</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-parchment-light border-2 border-sandy-gold">
                                <SelectValue placeholder="Select civilization" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-parchment border-sandy-gold">
                              {Object.keys(godsByCivilization).map((civilization) => (
                                <SelectItem key={civilization} value={civilization}>
                                  {civilization}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalInfoForm.control}
                      name="god"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">God</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!generalInfoForm.watch('civilization')}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-parchment-light border-2 border-sandy-gold">
                                <SelectValue placeholder={generalInfoForm.watch('civilization') ? "Select god" : "Select civilization first"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-parchment border-sandy-gold">
                              {(godsByCivilization[generalInfoForm.watch('civilization')] || []).map((god) => (
                                <SelectItem key={god} value={god}>
                                  {god}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalInfoForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-parchment-light border-2 border-sandy-gold">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-parchment border-sandy-gold">
                              {['Economic', 'Offensive', 'Defensive', 'Divine Powers', 'Mixed'].map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={generalInfoForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            autoComplete="off"
                            className="bg-parchment-light border-2 border-sandy-gold min-h-[100px]" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setConfirmDelete(true)}
                      disabled={deleting}
                    >
                      Delete Build Order
                    </Button>

                    <Button
                      type="submit"
                      className="bg-sandy-gold hover:bg-sandy-dark text-parchment-light"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>

                  {confirmDelete && (
                    <Alert variant="destructive" className="mt-4">
                      <div className="font-semibold">Delete this build order?</div>
                      <p className="text-sm mb-2">This action cannot be undone. All entries will also be deleted.</p>
                      <div className="flex justify-end gap-2 mt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setConfirmDelete(false)}
                          disabled={deleting}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={onDeleteBuildOrder}
                          disabled={deleting}
                        >
                          {deleting ? 'Deleting...' : 'Confirm Delete'}
                        </Button>
                      </div>
                    </Alert>
                  )}
                </form>
              </Form>
            </TabsContent>

            {/* Entries Tab */}
            <TabsContent value="entries" className="mt-0">
              {entries.length === 0 ? (
                <div className="text-center py-8 text-earthy-light">
                  <p>No entries have been added to this build order yet.</p>
                  <Button
                    onClick={() => setActiveTab('new-entry')}
                    className="bg-sandy-gold hover:bg-sandy-dark text-parchment-light mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Entry
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="min-w-full bg-parchment/90 backdrop-blur-sm border-2 border-sandy-gold">
                    <TableHeader className="sticky top-0 z-10">
                      <TableRow className="bg-sandy-gold/90 text-white">
                        <TableHead className="w-[60px] text-center font-cinzel text-white">#</TableHead>
                        <TableHead className="font-cinzel text-white">Main Action</TableHead>
                        <TableHead className="font-cinzel text-white">Details</TableHead>
                        <TableHead className="w-[140px] text-center font-cinzel text-white">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map((entry, index) => (
                        <React.Fragment key={entry.id}>
                          <TableRow className={`border-b border-sandy-gold hover:bg-parchment-dark transition-colors ${entry.isComplete ? 'bg-success-50' : ''}`}>
                            <TableCell className="font-medium text-center text-sandy-gold">
                              {entry.sequence}
                            </TableCell>
                            <TableCell className="text-sandy-gold">{entry.mainAction}</TableCell>
                            <TableCell className="text-sandy-gold">
                              {/* Removed time, villagerCount, agePhase, and population display */}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-1">
                                <Button 
                                  size="icon" 
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => moveEntry(entry.id, 'up')}
                                  disabled={index === 0 || saving}
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => moveEntry(entry.id, 'down')}
                                  disabled={index === entries.length - 1 || saving}
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="outline"
                                  className="h-7 w-7 border-sandy-gold"
                                  onClick={() => {
                                    setSelectedEntryId(entry.id);
                                    setActiveTab('edit-entry');
                                  }}
                                  disabled={saving}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                  </svg>
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="destructive"
                                  className="h-7 w-7"
                                  onClick={() => onDeleteEntry(entry.id)}
                                  disabled={saving}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {entry.miscellaneousAction && (
                            <TableRow className="bg-parchment-dark bg-opacity-40">
                              <TableCell></TableCell>
                              <TableCell colSpan={3} className="italic py-1 text-earthy-light">
                                {entry.miscellaneousAction}
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="mt-4">
                <Button
                  onClick={() => setActiveTab('new-entry')}
                  className="bg-sandy-gold hover:bg-sandy-dark text-parchment-light"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </div>
            </TabsContent>

            {/* New Entry Tab */}
            <TabsContent value="new-entry" className="mt-0">
              <Form {...entryForm}>
                <form onSubmit={entryForm.handleSubmit(onCreateEntry)} className="space-y-4">
                  <FormField
                    control={entryForm.control}
                    name="mainAction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Main Action</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            autoComplete="off"
                            placeholder="e.g., Build 3 villagers" 
                            className="bg-parchment-light border-2 border-sandy-gold" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={entryForm.control}
                    name="miscellaneousAction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Miscellaneous Action (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            autoComplete="off"
                            placeholder="e.g., Scout for food sources" 
                            className="bg-parchment-light border-2 border-sandy-gold" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="flex flex-col items-center">
                      <img src="/images/food.png" alt="Food" className="w-8 h-8 mb-2" />
                      <FormField
                        control={entryForm.control}
                        name="food"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                type="number"
                                {...field}
                                autoComplete="off"
                                value={field.value || ''}
                                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                className="bg-parchment-light border-2 border-sandy-gold w-24"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <img src="/images/wood.png" alt="Wood" className="w-8 h-8 mb-2" />
                      <FormField
                        control={entryForm.control}
                        name="wood"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                type="number"
                                {...field}
                                autoComplete="off"
                                value={field.value || ''}
                                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                className="bg-parchment-light border-2 border-sandy-gold w-24"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <img src="/images/gold.png" alt="Gold" className="w-8 h-8 mb-2" />
                      <FormField
                        control={entryForm.control}
                        name="gold"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                type="number"
                                {...field}
                                autoComplete="off"
                                value={field.value || ''}
                                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                className="bg-parchment-light border-2 border-sandy-gold w-24"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={entryForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            autoComplete="off"
                            placeholder="Additional notes about this step" 
                            className="bg-parchment-light border-2 border-sandy-gold min-h-[80px]" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        entryForm.reset();
                        setActiveTab('entries');
                      }}
                      className="border-sandy-gold text-earthy-dark"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-sandy-gold hover:bg-sandy-dark text-parchment-light"
                      disabled={saving}
                    >
                      {saving ? 'Adding...' : 'Add Entry'}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            {/* Edit Entry Tab */}
            {selectedEntryId && (
              <TabsContent value="edit-entry" className="mt-0">
                <Form {...editEntryForm}>
                  <form onSubmit={editEntryForm.handleSubmit(onUpdateEntry)} className="space-y-4">
                    <FormField
                      control={editEntryForm.control}
                      name="mainAction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Main Action</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              autoComplete="off"
                              className="bg-parchment-light border-2 border-sandy-gold" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editEntryForm.control}
                      name="miscellaneousAction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Miscellaneous Action (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              autoComplete="off"
                              className="bg-parchment-light border-2 border-sandy-gold" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex flex-col items-center">
                        <img src="/images/food.png" alt="Food" className="w-8 h-8 mb-2" />
                        <FormField
                          control={editEntryForm.control}
                          name="food"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  type="number"
                                  {...field}
                                  autoComplete="off"
                                  value={field.value || ''}
                                  onChange={e => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                  className="bg-parchment-light border-2 border-sandy-gold w-24"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <img src="/images/wood.png" alt="Wood" className="w-8 h-8 mb-2" />
                        <FormField
                          control={editEntryForm.control}
                          name="wood"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  type="number"
                                  {...field}
                                  autoComplete="off"
                                  value={field.value || ''}
                                  onChange={e => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                  className="bg-parchment-light border-2 border-sandy-gold w-24"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <img src="/images/gold.png" alt="Gold" className="w-8 h-8 mb-2" />
                        <FormField
                          control={editEntryForm.control}
                          name="gold"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  type="number"
                                  {...field}
                                  autoComplete="off"
                                  value={field.value || ''}
                                  onChange={e => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                  className="bg-parchment-light border-2 border-sandy-gold w-24"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={editEntryForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} autoComplete="off"
                              className="bg-parchment-light border-2 border-sandy-gold min-h-[80px]" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          if (selectedEntryId) {
                            onDeleteEntry(selectedEntryId);
                            setActiveTab('entries');
                          }
                        }}
                        disabled={saving || !selectedEntryId}
                      >
                        Delete Entry
                      </Button>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setSelectedEntryId(null);
                            setActiveTab('entries');
                          }}
                          className="border-sandy-gold text-earthy-dark"
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-sandy-gold hover:bg-sandy-dark text-parchment-light"
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            )}
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditBuildOrderDialog;