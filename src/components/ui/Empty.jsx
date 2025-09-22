import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  description = "It looks like there's nothing here yet.",
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-32 h-32 bg-gradient-to-br from-accent/10 to-blue-100 rounded-full flex items-center justify-center mb-8">
        <ApperIcon 
          name="ShoppingBag" 
          size={64} 
          className="text-accent"
        />
      </div>
      
      <h3 className="text-3xl font-bold text-primary mb-4">
        {title}
      </h3>
      
      <p className="text-secondary mb-8 max-w-md leading-relaxed text-lg">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name={action.icon || "Plus"} size={20} />
          {action.label}
        </button>
      )}
    </div>
  );
};

export default Empty;