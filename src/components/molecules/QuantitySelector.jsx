import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const QuantitySelector = ({ 
  value, 
  onChange, 
  min = 1, 
  max = 100, 
  className,
  disabled = false 
}) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value) || min;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={cn("flex items-center", className)}>
      <button
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="flex items-center justify-center w-10 h-12 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <ApperIcon name="Minus" size={16} className="text-secondary" />
      </button>
      
      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        className="w-16 h-12 text-center border-y border-gray-300 rounded-none focus:z-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      
      <button
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="flex items-center justify-center w-10 h-12 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <ApperIcon name="Plus" size={16} className="text-secondary" />
      </button>
    </div>
  );
};

export default QuantitySelector;