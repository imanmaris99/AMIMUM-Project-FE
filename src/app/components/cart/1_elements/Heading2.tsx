import React, { ReactNode } from "react";

interface Heading2Props {
  children: ReactNode;
  className?: string;
}

const Heading2 = ({ children, className }: Heading2Props) => {
  return (
    <>
      <h2 className={`${className} text-sm`}>{children}</h2>
    </>
  );
};

export default Heading2;
