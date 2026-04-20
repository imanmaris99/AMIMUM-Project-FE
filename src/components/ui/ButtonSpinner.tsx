"use client";

import React from "react";

interface ButtonSpinnerProps {
  size?: "sm" | "md";
  color?: "primary" | "white" | "gray";
  text?: string;
}

const ButtonSpinner: React.FC<ButtonSpinnerProps> = ({ 
  size = "sm", 
  color = "white", 
  text = "Memproses..."
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5"
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
  `.trim();

  return (
    <div className="flex items-center justify-center gap-2">
      <div className={spinnerClasses} />
      <span>{text}</span>
    </div>
  );
};

export default ButtonSpinner;
