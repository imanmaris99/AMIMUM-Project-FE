"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "gray";
  className?: string;
  label?: string;
  inline?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "md", 
  color = "primary", 
  className = "",
  label,
  inline = false
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const colorClasses = {
    primary: "border-primary border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-gray-400 border-t-transparent"
  };

  const spinnerClasses = `
    ${sizeClasses[size]}
    ${colorClasses[color]}
    border-2
    rounded-full
    animate-spin
    ${inline ? "inline-block" : "block"}
    ${className}
  `.trim();

  return (
    <div className={inline ? "flex items-center gap-2" : "flex flex-col items-center"}>
      <div 
        className={spinnerClasses}
        aria-label={label || "Loading..."}
        role="status"
      />
      {label && (
        <span className={`text-sm text-gray-600 ${inline ? "ml-2" : "mt-2"}`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
