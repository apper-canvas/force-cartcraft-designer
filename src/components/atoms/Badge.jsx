import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200";
  
  const variants = {
    primary: "bg-gradient-to-r from-accent to-blue-600 text-white",
    secondary: "bg-gray-100 text-gray-700",
    success: "bg-gradient-to-r from-success to-green-600 text-white",
    warning: "bg-gradient-to-r from-warning to-yellow-500 text-white",
    error: "bg-gradient-to-r from-error to-red-600 text-white",
    outline: "bg-transparent text-accent border-2 border-accent"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs min-w-[20px] h-5",
    md: "px-3 py-1.5 text-sm min-w-[24px] h-6",
    lg: "px-4 py-2 text-base min-w-[28px] h-8"
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;