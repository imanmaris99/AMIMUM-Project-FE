import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button = ({ children, className, onClick }: ButtonProps) => {
  return (
    <>
      <button onClick={onClick} className={`${className}`}>
        {children}
      </button>
    </>
  );
};

export default Button;
