import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const ProductSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  categories = [],
  brands = [],
  priceRange = { min: 0, max: 3000 }
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleCategoryChange = (category) => {
    const updatedCategories = localFilters.categories.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...localFilters.categories, category];
    
    const newFilters = { ...localFilters, categories: updatedCategories };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceChange = (type, value) => {
    const newPriceRange = { ...localFilters.priceRange, [type]: parseFloat(value) };
    const newFilters = { ...localFilters, priceRange: newPriceRange };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRatingChange = (rating) => {
    const newFilters = { 
      ...localFilters, 
      minRating: localFilters.minRating === rating ? 0 : rating 
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleBrandChange = (brand) => {
    const updatedBrands = localFilters.brands.includes(brand)
      ? localFilters.brands.filter(b => b !== brand)
      : [...localFilters.brands, brand];
    
    const newFilters = { ...localFilters, brands: updatedBrands };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      categories: [],
      brands: [],
      priceRange: { min: priceRange.min, max: priceRange.max },
      minRating: 0
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = 
    localFilters.categories.length > 0 ||
    localFilters.brands.length > 0 ||
    localFilters.minRating > 0 ||
    localFilters.priceRange.min > priceRange.min ||
    localFilters.priceRange.max < priceRange.max;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <ApperIcon
        key={i}
        name="Star"
        size={16}
        className={cn(
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        )}
      />
    ));
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "fixed lg:relative top-0 left-0 h-full lg:h-auto bg-white border-r border-gray-200 z-50",
          "w-80 lg:w-72 overflow-y-auto flex-shrink-0"
        )}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-primary">Filters</h3>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs px-3 py-1"
                >
                  Clear All
                </Button>
              )}
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h4 className="font-medium text-primary mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={localFilters.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent/20"
                    />
                    <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-medium text-primary mb-3">Price Range</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-secondary mb-1">Min</label>
                    <input
                      type="number"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={localFilters.priceRange.min}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-accent focus:ring-1 focus:ring-accent/20"
                    />
                  </div>
                  <span className="text-secondary mt-5">-</span>
                  <div className="flex-1">
                    <label className="block text-xs text-secondary mb-1">Max</label>
                    <input
                      type="number"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={localFilters.priceRange.max}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-accent focus:ring-1 focus:ring-accent/20"
                    />
                  </div>
                </div>
                
                {/* Range slider */}
                <div className="px-2">
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={localFilters.priceRange.max}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <div className="flex justify-between text-xs text-secondary mt-1">
                    <span>${priceRange.min}</span>
                    <span>${priceRange.max}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 className="font-medium text-primary mb-3">Minimum Rating</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="rating"
                      checked={localFilters.minRating === rating}
                      onChange={() => handleRatingChange(rating)}
                      className="w-4 h-4 text-accent border-gray-300 focus:ring-accent/20"
                    />
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {renderStars(rating)}
                      </div>
                      <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                        & up
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
              <div>
                <h4 className="font-medium text-primary mb-3">Brands</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={localFilters.brands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent/20"
                      />
                      <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProductSidebar;