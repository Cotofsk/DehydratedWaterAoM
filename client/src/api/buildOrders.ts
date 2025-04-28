import { apiRequest } from "../lib/queryClient";
import { BuildOrder } from "@shared/schema";

// Get all build orders with optional filters
export const fetchBuildOrders = async (filters?: {
  civilization?: string;
  god?: string;
  type?: string;
}) => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.civilization) queryParams.append('civilization', filters.civilization);
    if (filters.god) queryParams.append('god', filters.god);
    if (filters.type) queryParams.append('type', filters.type);
  }
  
  const queryString = queryParams.toString();
  const url = `/api/build-orders${queryString ? `?${queryString}` : ''}`;
  
  return await apiRequest<BuildOrder[]>(url);
};

// Get a specific build order by ID
export const fetchBuildOrder = async (id: number) => {
  return await apiRequest<BuildOrder>(`/api/build-orders/${id}`);
};

// Create a new build order
export const createBuildOrder = async (buildOrder: Omit<BuildOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
  return await apiRequest<BuildOrder>('/api/build-orders', {
    method: 'POST',
    body: JSON.stringify(buildOrder),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Update a build order
export const updateBuildOrder = async (id: number, buildOrder: Partial<Omit<BuildOrder, 'id' | 'createdAt' | 'updatedAt'>>) => {
  return await apiRequest<BuildOrder>(`/api/build-orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(buildOrder),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Delete a build order
export const deleteBuildOrder = async (id: number) => {
  return await apiRequest(`/api/build-orders/${id}`, {
    method: 'DELETE',
  });
};

// Fetch build order entries
export const fetchBuildOrderEntries = async (buildOrderId: number) => {
  return await apiRequest<any[]>(`/api/build-orders/${buildOrderId}/entries`);
};

// Create a build order entry
export const createBuildOrderEntry = async (buildOrderId: number, entry: any) => {
  return await apiRequest<any>(`/api/build-orders/${buildOrderId}/entries`, {
    method: 'POST',
    body: JSON.stringify(entry),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Update a build order entry
export const updateBuildOrderEntry = async (entryId: number, entry: any) => {
  return await apiRequest<any>(`/api/build-order-entries/${entryId}`, {
    method: 'PUT',
    body: JSON.stringify(entry),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Delete a build order entry
export const deleteBuildOrderEntry = async (entryId: number) => {
  return await apiRequest(`/api/build-order-entries/${entryId}`, {
    method: 'DELETE',
  });
};

// Reorder build order entries
export const reorderBuildOrderEntries = async (buildOrderId: number, entryIds: number[]) => {
  return await apiRequest<any[]>(`/api/build-orders/${buildOrderId}/entries/reorder`, {
    method: 'POST',
    body: JSON.stringify({ entryIds }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};