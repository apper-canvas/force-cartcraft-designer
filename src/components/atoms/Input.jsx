import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text", 
  className, 
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full px-4 py-3 text-base text-primary bg-white border border-gray-300 rounded-lg transition-all duration-200",
        "placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent",
        "hover:border-gray-400",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;