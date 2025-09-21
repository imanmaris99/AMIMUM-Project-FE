// Enhanced Loading Spinner with better UX
import React from "react";

interface EnhancedLoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "gray" | "green" | "blue" | "red";
  variant?: "spinner" | "dots" | "pulse" | "skeleton";
  className?: string;
  label?: string;
  inline?: boolean;
  showProgress?: boolean;
  progress?: number;
  estimatedTime?: number; // in seconds
}

const EnhancedLoadingSpinner: React.FC<EnhancedLoadingSpinnerProps> = ({
  size = "md",
  color = "primary",
  variant = "spinner",
  className = "",
  label,
  inline = false,
  showProgress = false,
  progress = 0,
  estimatedTime
}) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  const colorClasses = {
    primary: "border-primary border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-gray-400 border-t-transparent",
    green: "border-green-500 border-t-transparent",
    blue: "border-blue-500 border-t-transparent",
    red: "border-red-500 border-t-transparent"
  };

  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s"
                }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <div
            className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
          />
        );

      case "skeleton":
        return (
          <div className="animate-pulse">
            <div className={`${sizeClasses[size]} bg-gray-300 rounded`} />
          </div>
        );

      default:
        return (
          <div
            className={`
              ${sizeClasses[size]}
              ${colorClasses[color]}
              border-2
              rounded-full
              animate-spin
              ${inline ? "inline-block" : "block"}
              ${className}
            `.trim()}
            aria-label={label || "Loading..."}
            role="status"
          />
        );
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.ceil(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.ceil(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className={inline ? "flex items-center gap-2" : "flex flex-col items-center"}>
      {renderSpinner()}
      
      {label && (
        <span className={`text-sm text-gray-600 ${inline ? "ml-2" : "mt-2"}`}>
          {label}
        </span>
      )}
      
      {showProgress && (
        <div className="w-full max-w-xs mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
      
      {estimatedTime && (
        <span className="text-xs text-gray-500 mt-1">
          Estimated time: {formatTime(estimatedTime)}
        </span>
      )}
    </div>
  );
};

export default EnhancedLoadingSpinner;
