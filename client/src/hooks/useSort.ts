import { useState, useMemo } from 'react';

interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

function useSort<T>(items: T[], initialConfig?: SortConfig) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(initialConfig || null);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedItems = useMemo(() => {
    const sortableItems = [...items];
    
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        // TypeScript doesn't know that a[sortConfig.key] exists, so we need to use this approach
        const aValue = (a as any)[sortConfig.key];
        const bValue = (b as any)[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableItems;
  }, [items, sortConfig]);

  return { sortedItems, sortConfig, requestSort };
}

export default useSort;
