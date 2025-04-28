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
  
  const res = await apiRequest('GET', url);
  return res.json() as Promise<BuildOrder[]>;
};

// Get a specific build order by ID
export const fetchBuildOrder = async (id: number) => {
  const res = await apiRequest('GET', `/api/build-orders/${id}`);
  return res.json() as Promise<BuildOrder>;
};

// Create a new build order
export const createBuildOrder = async (buildOrder: InsertBuildOrder) => {
  const res = await apiRequest('POST', '/api/build-orders', buildOrder);
  return res.json() as Promise<BuildOrder>;
};

// Update a build order
export const updateBuildOrder = async (id: number, buildOrder: Partial<InsertBuildOrder>) => {
  const res = await apiRequest('PUT', `/api/build-orders/${id}`, buildOrder);
  return res.json() as Promise<BuildOrder>;
};

// Delete a build order
export const deleteBuildOrder = async (id: number) => {
  return apiRequest('DELETE', `/api/build-orders/${id}`);
};

// Fetch build order entries
export const fetchBuildOrderEntries = async (buildOrderId: number) => {
  const res = await apiRequest('GET', `/api/build-orders/${buildOrderId}/entries`);
  return res.json() as Promise<BuildOrderEntry[]>;
};

// Create a build order entry
export const createBuildOrderEntry = async (buildOrderId: number, entry: Omit<InsertBuildOrderEntry, 'buildOrderId'>) => {
  const res = await apiRequest('POST', `/api/build-orders/${buildOrderId}/entries`, entry);
  return res.json() as Promise<BuildOrderEntry>;
};

// Update a build order entry
export const updateBuildOrderEntry = async (entryId: number, entry: Partial<Omit<InsertBuildOrderEntry, 'buildOrderId'>>) => {
  const res = await apiRequest('PUT', `/api/build-order-entries/${entryId}`, entry);
  return res.json() as Promise<BuildOrderEntry>;
};

// Delete a build order entry
export const deleteBuildOrderEntry = async (entryId: number) => {
  return apiRequest('DELETE', `/api/build-order-entries/${entryId}`);
};

// Reorder build order entries
export const reorderBuildOrderEntries = async (buildOrderId: number, entryIds: number[]) => {
  const res = await apiRequest('POST', `/api/build-orders/${buildOrderId}/entries/reorder`, { entryIds });
  return res.json() as Promise<BuildOrderEntry[]>;
};