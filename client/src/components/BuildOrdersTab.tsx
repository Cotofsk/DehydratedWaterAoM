import React, { useState, useMemo } from "react";
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
import { Eye, ChevronLeft, ChevronRight, Star as StarIcon } from "lucide-react";
import useSort from "@/hooks/useSort";
import { buildOrders as mockBuildOrders } from "@/data/buildOrders";

// Build Order Type 
interface BuildOrder {
  id: number;
  name: string;
  civilization: string;
  type: string;
  difficulty: number;
  time: string;
  description: string;
}

const BuildOrdersTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [civilizationFilter, setCivilizationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Use local data for now instead of fetching from server
  const isLoading = false;
  const buildOrders = mockBuildOrders;

  const { sortedItems, sortConfig, requestSort } = useSort<BuildOrder>(buildOrders);

  // Filter build orders based on search and civilization
  const filteredBuildOrders = useMemo(() => {
    return sortedItems.filter(order => {
      const matchesSearch = 
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.civilization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCivilization = 
        civilizationFilter === "all" || 
        order.civilization.toLowerCase() === civilizationFilter.toLowerCase();
      
      return matchesSearch && matchesCivilization;
    });
  }, [sortedItems, searchTerm, civilizationFilter]);

  // Pagination
  const pageCount = Math.ceil(filteredBuildOrders.length / itemsPerPage);
  const paginatedBuildOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBuildOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBuildOrders, currentPage]);

  // Civilization options for filter dropdown
  const civilizationOptions = useMemo(() => {
    const civilizations = Array.from(new Set(buildOrders.map(order => order.civilization)));
    return ["all", ...civilizations];
  }, [buildOrders]);

  // Render difficulty stars
  const renderDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <StarIcon 
        key={i} 
        className={`h-4 w-4 ${i < difficulty ? 'text-accent-gold fill-accent-gold' : 'text-accent-gold'}`} 
      />
    ));
  };

  // Change page
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading ancient scrolls...</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-cinzel font-bold text-earthy-dark mb-4 md:mb-0">Build Orders</h2>
        
        {/* Filter and search controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Select 
            value={civilizationFilter} 
            onValueChange={setCivilizationFilter}
          >
            <SelectTrigger className="bg-parchment-light border-2 border-sandy-gold w-full sm:w-[180px]">
              <SelectValue placeholder="Civilization" />
            </SelectTrigger>
            <SelectContent className="bg-parchment border-sandy-gold">
              <SelectItem value="all">All Civilizations</SelectItem>
              {civilizationOptions.filter(civ => civ !== "all").map(civilization => (
                <SelectItem key={civilization} value={civilization.toLowerCase()}>
                  {civilization}
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

      {/* Build orders table */}
      <div className="overflow-x-auto scroll-design">
        <Table className="min-w-full border-2 border-sandy-gold bg-parchment bg-opacity-50">
          <TableHeader>
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
              <TableHead 
                className="px-4 py-3 text-left font-cinzel cursor-pointer"
                onClick={() => requestSort('difficulty')}
              >
                <div className="flex items-center">
                  Difficulty
                  {sortConfig?.key === 'difficulty' && (
                    <span className="ml-1 text-xs">
                      {sortConfig.direction === 'ascending' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="px-4 py-3 text-left font-cinzel cursor-pointer"
                onClick={() => requestSort('time')}
              >
                <div className="flex items-center">
                  Time
                  {sortConfig?.key === 'time' && (
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
            {paginatedBuildOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No build orders found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              paginatedBuildOrders.map((order) => (
                <TableRow key={order.id} className="border-b border-sandy-gold hover:bg-parchment-dark transition-colors">
                  <TableCell className="px-4 py-3 font-semibold">{order.name}</TableCell>
                  <TableCell className="px-4 py-3">{order.civilization}</TableCell>
                  <TableCell className="px-4 py-3">{order.type}</TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex">
                      {renderDifficultyStars(order.difficulty)}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">{order.time}</TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Button className="bg-sandy-gold hover:bg-sandy-dark text-parchment-light px-3 py-1 h-8">
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {filteredBuildOrders.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-earthy-brown">
            Showing <span className="font-semibold">
              {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredBuildOrders.length)}
            </span> of <span className="font-semibold">{filteredBuildOrders.length}</span> build orders
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="px-3 py-1 bg-parchment-dark border border-sandy-gold rounded-md hover:bg-sandy-gold hover:text-parchment-light transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: Math.min(pageCount, 4) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={i}
                  onClick={() => goToPage(pageNum)}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className={`px-3 py-1 border border-sandy-gold rounded-md transition-colors ${
                    currentPage === pageNum 
                      ? "bg-sandy-gold text-parchment-light" 
                      : "bg-parchment-dark hover:bg-sandy-gold hover:text-parchment-light"
                  }`}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button 
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === pageCount || pageCount === 0}
              variant="outline"
              size="sm"
              className="px-3 py-1 bg-parchment-dark border border-sandy-gold rounded-md hover:bg-sandy-gold hover:text-parchment-light transition-colors disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildOrdersTab;
