
import React from "react";
import { X, Filter } from "lucide-react";

interface FilterSidebarProps {
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
  selectedTypes: string[];
  handleToggleType: (type: string) => void;
  wasteTypes: string[];
  typeLabels?: Record<string, string>;
  typeColors?: Record<string, string>;
}

const FilterSidebar = ({
  showFilter,
  setShowFilter,
  selectedTypes,
  handleToggleType,
  wasteTypes,
  typeLabels = {},
  typeColors = {}
}: FilterSidebarProps) => {
  // Format type for display if no label provided
  const formatType = (type: string): string => {
    return typeLabels[type] || type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get color for type or fallback
  const getTypeColor = (type: string): string => {
    return typeColors[type] || "#3B82F6";
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-800 shadow-xl z-30 transition-all duration-300 ease-in-out ${
        showFilter ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ width: "280px" }}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="flex items-center text-lg font-bold">
          <Filter className="mr-2 h-5 w-5" /> 
          Filter Waste Types
        </h2>
        <button
          onClick={() => setShowFilter(false)}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close filter panel"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex flex-col space-y-3">
          {wasteTypes.map((type) => (
            <label
              key={type}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                selectedTypes.includes(type)
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              <span
                className="w-4 h-4 rounded mr-3 flex-shrink-0"
                style={{ backgroundColor: getTypeColor(type) }}
              />
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedTypes.includes(type)}
                onChange={() => handleToggleType(type)}
              />
              <span className="flex-1">{formatType(type)}</span>
              <span
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  selectedTypes.includes(type)
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {selectedTypes.includes(type) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3 h-3 text-white"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              if (selectedTypes.length === wasteTypes.length) {
                // If all selected, clear all
                setShowFilter(false);
                setTimeout(() => {
                  wasteTypes.forEach(type => {
                    if (selectedTypes.includes(type)) {
                      handleToggleType(type);
                    }
                  });
                }, 300);
              } else {
                // Select all
                wasteTypes.forEach(type => {
                  if (!selectedTypes.includes(type)) {
                    handleToggleType(type);
                  }
                });
                setTimeout(() => setShowFilter(false), 300);
              }
            }}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            {selectedTypes.length === wasteTypes.length
              ? "Clear All Filters"
              : "Select All Types"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
