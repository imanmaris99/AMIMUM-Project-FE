import React, { ReactNode } from "react";

interface Heading1Props {
  children: ReactNode;
  className?: string;
}

const Heading1 = ({ children, className }: Heading1Props) => {
  return (
    <>
      <p className={`${className} text-base`}>{children}</p>
    </>
  );
};

export default Heading1;
