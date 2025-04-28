import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createBuildOrder } from '@/api/buildOrders';
import { godsByCivilization } from '@/data/buildOrders';
import { queryClient } from '@/lib/queryClient';

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  civilization: z.string().min(1, { message: 'Please select a civilization' }),
  god: z.string().min(1, { message: 'Please select a god' }),
  type: z.string().min(1, { message: 'Please select a type' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateBuildOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateBuildOrderDialog: React.FC<CreateBuildOrderDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Civilization options
  const civilizationOptions = Object.keys(godsByCivilization);
  
  // Get the default values for the form
  const defaultValues: FormValues = {
    name: '',
    civilization: '',
    god: '',
    type: '',
    description: '',
  };
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  // Get the current civilization value
  const watchCivilization = form.watch('civilization');
  
  // Reset god when civilization changes
  useEffect(() => {
    form.setValue('god', '');
  }, [watchCivilization, form]);
  
  // Get gods for the selected civilization
  const godOptions = watchCivilization ? godsByCivilization[watchCivilization] || [] : [];
  
  // Types of build orders
  const typeOptions = ['Economic', 'Offensive', 'Defensive', 'Divine Powers', 'Mixed'];
  
  // Submit handler
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      await createBuildOrder({
        ...data,
        isPublic: true,
      });
      
      // Show success toast
      toast({
        title: 'Build Order Created',
        description: 'Your build order has been created successfully.',
      });
      
      // Reset form and close dialog
      form.reset(defaultValues);
      onOpenChange(false);
      
      // Invalidate build orders query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/build-orders'] });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating build order:', error);
      toast({
        title: 'Error',
        description: 'There was an error creating your build order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-parchment sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-cinzel text-earthy-dark">Create New Build Order</DialogTitle>
          <DialogDescription className="text-earthy-brown">
            Fill in the details to create your build order. You can add steps later.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-earthy-dark">Build Order Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter a descriptive name" 
                      {...field} 
                      className="bg-parchment-light border-2 border-sandy-gold" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="civilization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-earthy-dark">Civilization</FormLabel>
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
                        {civilizationOptions.map((civ) => (
                          <SelectItem key={civ} value={civ}>
                            {civ}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="god"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-earthy-dark">God</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!watchCivilization}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-parchment-light border-2 border-sandy-gold">
                          <SelectValue placeholder={watchCivilization ? "Select god" : "Select civilization first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-parchment border-sandy-gold">
                        {godOptions.map((god) => (
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
            </div>
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-earthy-dark">Build Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-parchment-light border-2 border-sandy-gold">
                        <SelectValue placeholder="Select build type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-parchment border-sandy-gold">
                      {typeOptions.map((type) => (
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
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-earthy-dark">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the purpose and strategy of this build order" 
                      {...field}
                      className="bg-parchment-light border-2 border-sandy-gold min-h-[80px]" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-sandy-gold text-earthy-dark"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-sandy-gold hover:bg-sandy-dark text-parchment-light"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Build Order'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBuildOrderDialog;