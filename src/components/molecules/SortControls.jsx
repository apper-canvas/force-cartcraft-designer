import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SortControls = ({ 
  sortBy, 
  onSortChange, 
  resultCount, 
  totalCount, 
  hasActiveFilters = false,
  onClearFilters,
  className 
}) => {
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest' }
  ];

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", className)}>
      {/* Results count and active filters */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-secondary">
          Showing <span className="font-medium text-primary">{resultCount}</span> of{' '}
          <span className="font-medium text-primary">{totalCount}</span> products
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
          >
            <ApperIcon name="X" size={14} />
            Clear filters
          </button>
        )}
      </div>

      {/* Sort dropdown */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-secondary whitespace-nowrap">Sort by:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm focus:border-accent focus:ring-1 focus:ring-accent/20 cursor-pointer"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ApperIcon 
            name="ChevronDown" 
            size={16} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};

export default SortControls;