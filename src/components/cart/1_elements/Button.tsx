import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ children, className, onClick, disabled }: ButtonProps) => {
  return (
    <>
      <button onClick={onClick} className={`${className}`} disabled={disabled}>
        {children}
      </button>
    </>
  );
};

export default Button;
