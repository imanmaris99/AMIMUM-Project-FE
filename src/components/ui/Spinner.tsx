import React from "react";

interface SpinnerProps {
  className?: string;
  size?: number;
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className = "", size = 48, label = "Memuat..." }) => (
  <span
    className={`loader ${className}`}
    style={{ width: size, height: size }}
    aria-label={label}
    role="status"
  />
);

export default Spinner; 