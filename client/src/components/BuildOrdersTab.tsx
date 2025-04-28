import React, { useState, useMemo, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Plus } from "lucide-react";
import useSort from "@/hooks/useSort";
import { buildOrders as mockBuildOrders, godsByCivilization } from "@/data/buildOrders";

// Build Order Type 
interface BuildOrder {
  id: number;
  name: string;
  civilization: string;
  god: string;
  type: string;
  description: string;
}

const BuildOrdersTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [civilizationFilter, setCivilizationFilter] = useState("all");
  const [godFilter, setGodFilter] = useState("all");

  // Use local data for now instead of fetching from server
  const isLoading = false;
  const buildOrders = mockBuildOrders;

  // Reset god filter when civilization changes
  useEffect(() => {
    setGodFilter("all");
  }, [civilizationFilter]);

  const { sortedItems, sortConfig, requestSort } = useSort<BuildOrder>(buildOrders);

  // Filter build orders based on search, civilization, and god
  const filteredBuildOrders = useMemo(() => {
    return sortedItems.filter(order => {
      const matchesSearch = 
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.civilization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.god.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCivilization = 
        civilizationFilter === "all" || 
        order.civilization === civilizationFilter;

      const matchesGod =
        godFilter === "all" ||
        order.god === godFilter;
      
      return matchesSearch && matchesCivilization && matchesGod;
    });
  }, [sortedItems, searchTerm, civilizationFilter, godFilter]);

  // Civilization options for filter dropdown
  const civilizationOptions = useMemo(() => {
    const civilizations = Array.from(new Set(buildOrders.map(order => order.civilization)));
    return ["all", ...civilizations];
  }, [buildOrders]);

  // God options based on selected civilization
  const godOptions = useMemo(() => {
    if (civilizationFilter === "all") {
      return ["all"];
    } else {
      // Find gods for the selected civilization
      const godsForCivilization = godsByCivilization[civilizationFilter] || [];
      return ["all", ...godsForCivilization];
    }
  }, [civilizationFilter]);

  // Handle create build order
  const handleCreateBuildOrder = () => {
    alert("Create Build Order feature will be implemented soon!");
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading ancient scrolls...</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-cinzel font-bold text-earthy-dark mb-4 md:mb-0">Build Orders</h2>
        
        {/* Filter and search controls */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Select 
            value={civilizationFilter} 
            onValueChange={setCivilizationFilter}
          >
            <SelectTrigger className="bg-parchment-light border-2 border-sandy-gold w-full md:w-[180px]">
              <SelectValue placeholder="Civilization" />
            </SelectTrigger>
            <SelectContent className="bg-parchment border-sandy-gold">
              <SelectItem value="all">All Civilizations</SelectItem>
              {civilizationOptions.filter(civ => civ !== "all").map(civilization => (
                <SelectItem key={civilization} value={civilization}>
                  {civilization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={godFilter} 
            onValueChange={setGodFilter}
          >
            <SelectTrigger className="bg-parchment-light border-2 border-sandy-gold w-full md:w-[180px]">
              <SelectValue placeholder="God" />
            </SelectTrigger>
            <SelectContent className="bg-parchment border-sandy-gold">
              <SelectItem value="all">All Gods</SelectItem>
              {godOptions.filter(god => god !== "all").map(god => (
                <SelectItem key={god} value={god}>
                  {god}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="relative">
            <Input
              type="text"
              placeholder="Search build orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-parchment-light border-2 border-sandy-gold w-full sm:w-auto"
            />
          </div>
        </div>
      </div>

      {/* Build orders table with scrolling */}
      <div className="overflow-x-auto overflow-y-auto max-h-[400px] scroll-design rounded-lg border-2 border-sandy-gold">
        <Table className="min-w-full bg-parchment bg-opacity-50">
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-earthy-brown text-parchment-light">
              <TableHead 
                className="px-4 py-3 text-left font-cinzel cursor-pointer"
                onClick={() => requestSort('name')}
              >
                <div className="flex items-center">
                  Build Name 
                  {sortConfig?.key === 'name' && (
                    <span className="ml-1 text-xs">
                      {sortConfig.direction === 'ascending' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="px-4 py-3 text-left font-cinzel cursor-pointer"
                onClick={() => requestSort('civilization')}
              >
                <div className="flex items-center">
                  Civilization
                  {sortConfig?.key === 'civilization' && (
                    <span className="ml-1 text-xs">
                      {sortConfig.direction === 'ascending' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="px-4 py-3 text-left font-cinzel cursor-pointer"
                onClick={() => requestSort('god')}
              >
                <div className="flex items-center">
                  God
                  {sortConfig?.key === 'god' && (
                    <span className="ml-1 text-xs">
                      {sortConfig.direction === 'ascending' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="px-4 py-3 text-left font-cinzel cursor-pointer"
                onClick={() => requestSort('type')}
              >
                <div className="flex items-center">
                  Type
                  {sortConfig?.key === 'type' && (
                    <span className="ml-1 text-xs">
                      {sortConfig.direction === 'ascending' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="px-4 py-3 text-center font-cinzel">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBuildOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No build orders found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredBuildOrders.map((order: BuildOrder) => (
                <TableRow key={order.id} className="border-b border-sandy-gold hover:bg-parchment-dark transition-colors">
                  <TableCell className="px-4 py-3 font-semibold">{order.name}</TableCell>
                  <TableCell className="px-4 py-3">{order.civilization}</TableCell>
                  <TableCell className="px-4 py-3">{order.god}</TableCell>
                  <TableCell className="px-4 py-3">{order.type}</TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button className="bg-sandy-gold hover:bg-sandy-dark text-parchment-light px-3 py-1 h-8">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button size="sm" variant="outline" className="bg-parchment-dark h-8 w-8 p-0 min-w-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Build Order button */}
      <div className="mt-6 flex justify-center">
        <Button 
          onClick={handleCreateBuildOrder}
          className="bg-accent-gold hover:bg-accent-dark text-parchment-light font-cinzel font-semibold py-2 px-6 text-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Build Order
        </Button>
      </div>
    </div>
  );
};

export default BuildOrdersTab;