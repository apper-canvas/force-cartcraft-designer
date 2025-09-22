import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CheckoutProgressIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, title: "Shipping", icon: "Truck" },
    { number: 2, title: "Payment", icon: "CreditCard" },
    { number: 3, title: "Review", icon: "CheckCircle" }
  ];

  return (
    <div className="flex items-center justify-between max-w-md mx-auto">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                currentStep > step.number
                  ? "bg-success border-success text-white"
                  : currentStep === step.number
                  ? "bg-accent border-accent text-white"
                  : "bg-surface border-secondary text-secondary"
              )}
            >
              {currentStep > step.number ? (
                <ApperIcon name="Check" size={16} />
              ) : (
                <ApperIcon name={step.icon} size={16} />
              )}
            </div>
            <div className="ml-3 hidden sm:block">
              <p
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  currentStep >= step.number ? "text-primary" : "text-secondary"
                )}
              >
                {step.title}
              </p>
              <p
                className={cn(
                  "text-xs transition-colors duration-200",
                  currentStep > step.number
                    ? "text-success"
                    : currentStep === step.number
                    ? "text-accent"
                    : "text-secondary"
                )}
              >
                Step {step.number}
              </p>
            </div>
          </div>
          
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mx-4 transition-colors duration-200",
                currentStep > step.number + 1 ? "bg-success" : "bg-secondary/30"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutProgressIndicator;