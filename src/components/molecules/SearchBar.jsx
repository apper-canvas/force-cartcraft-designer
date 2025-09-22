import React, { useState, useEffect, useRef } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ onSearch, placeholder = "Search products...", className, suggestions = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch && searchTerm.trim()) {
        onSearch(searchTerm.trim());
      } else if (onSearch && !searchTerm.trim()) {
        onSearch("");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      setSearchTerm(suggestions[selectedIndex]);
      if (onSearch) {
        onSearch(suggestions[selectedIndex]);
      }
    }
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedIndex(-1);
    setShowSuggestions(value.length > 0 && suggestions.length > 0);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    }
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleFocus = () => {
    if (searchTerm.length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = (e) => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (onSearch) {
      onSearch("");
    }
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative max-w-md w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="pl-12 pr-10 py-3 rounded-full border-gray-200 focus:border-accent focus:ring-accent/20"
          />
          <ApperIcon 
            name="Search" 
            size={20} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Auto-suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {suggestions.slice(0, 8).map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className={cn(
                "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg",
                selectedIndex === index && "bg-accent/10 text-accent"
              )}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-center gap-3">
                <ApperIcon name="Search" size={16} className="text-gray-400" />
                <span className="text-sm">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;