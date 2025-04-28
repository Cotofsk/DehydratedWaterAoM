import { apiRequest } from "../lib/queryClient";
import { BuildOrder, BuildOrderEntry, InsertBuildOrder, InsertBuildOrderEntry } from "@shared/schema";

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
  
  return apiRequest(url) as Promise<BuildOrder[]>;
};

// Get a specific build order by ID
export const fetchBuildOrder = async (id: number) => {
  return apiRequest(`/api/build-orders/${id}`) as Promise<BuildOrder>;
};

// Create a new build order
export const createBuildOrder = async (buildOrder: InsertBuildOrder) => {
  return apiRequest('/api/build-orders', {
    method: 'POST',
    body: JSON.stringify(buildOrder),
    headers: {
      'Content-Type': 'application/json',
    },
  }) as Promise<BuildOrder>;
};

// Update a build order
export const updateBuildOrder = async (id: number, buildOrder: Partial<InsertBuildOrder>) => {
  return apiRequest(`/api/build-orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(buildOrder),
    headers: {
      'Content-Type': 'application/json',
    },
  }) as Promise<BuildOrder>;
};

// Delete a build order
export const deleteBuildOrder = async (id: number) => {
  return apiRequest(`/api/build-orders/${id}`, {
    method: 'DELETE',
  });
};

// Fetch build order entries
export const fetchBuildOrderEntries = async (buildOrderId: number) => {
  return apiRequest(`/api/build-orders/${buildOrderId}/entries`) as Promise<BuildOrderEntry[]>;
};

// Create a build order entry
export const createBuildOrderEntry = async (buildOrderId: number, entry: Omit<InsertBuildOrderEntry, 'buildOrderId'>) => {
  return apiRequest(`/api/build-orders/${buildOrderId}/entries`, {
    method: 'POST',
    body: JSON.stringify(entry),
    headers: {
      'Content-Type': 'application/json',
    },
  }) as Promise<BuildOrderEntry>;
};

// Update a build order entry
export const updateBuildOrderEntry = async (entryId: number, entry: Partial<Omit<InsertBuildOrderEntry, 'buildOrderId'>>) => {
  return apiRequest(`/api/build-order-entries/${entryId}`, {
    method: 'PUT',
    body: JSON.stringify(entry),
    headers: {
      'Content-Type': 'application/json',
    },
  }) as Promise<BuildOrderEntry>;
};

// Delete a build order entry
export const deleteBuildOrderEntry = async (entryId: number) => {
  return apiRequest(`/api/build-order-entries/${entryId}`, {
    method: 'DELETE',
  });
};

// Reorder build order entries
export const reorderBuildOrderEntries = async (buildOrderId: number, entryIds: number[]) => {
  return apiRequest(`/api/build-orders/${buildOrderId}/entries/reorder`, {
    method: 'POST',
    body: JSON.stringify({ entryIds }),
    headers: {
      'Content-Type': 'application/json',
    },
  }) as Promise<BuildOrderEntry[]>;
};