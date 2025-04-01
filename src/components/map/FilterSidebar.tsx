
import React from "react";
import { Filter, X } from "lucide-react";

interface FilterSidebarProps {
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
  selectedTypes: string[];
  handleToggleType: (type: string) => void;
  wasteTypes: string[];
}

const FilterSidebar = ({ 
  showFilter, 
  setShowFilter, 
  selectedTypes, 
  handleToggleType,
  wasteTypes
}: FilterSidebarProps) => {
  return (
    <>
      {/* Floating Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-card shadow-lg p-4 z-50 transition-transform duration-300 ${
          showFilter ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Filter by Waste Type</h3>
          <button 
            onClick={() => setShowFilter(false)}
            className="p-1 rounded-full hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {wasteTypes.map((type) => (
          <label key={type} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-primary"
              checked={selectedTypes.includes(type)}
              onChange={() => handleToggleType(type)}
            />
            <span className="text-foreground">{type.replace(/_/g, " ")}</span>
          </label>
        ))}
        
        <button
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-md w-full hover:bg-primary/90"
          onClick={() => setShowFilter(false)}
        >
          Apply Filters
        </button>
      </div>

      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="fixed top-4 left-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg z-50"
        aria-label="Toggle filters"
      >
        <Filter className="w-5 h-5" />
      </button>
    </>
  );
};

export default FilterSidebar;
