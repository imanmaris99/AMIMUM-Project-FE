import React, { ReactNode } from "react";

interface Heading2Props {
  children: ReactNode;
  className?: string;
}

const Heading2 = ({ children, className }: Heading2Props) => {
  return (
    <>
      <p className={`${className} text-sm`}>{children}</p>
    </>
  );
};

export default Heading2;
