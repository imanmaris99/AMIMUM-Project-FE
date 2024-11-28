import React, { ReactNode } from "react";

interface Heading1Props {
  children: ReactNode;
  className?: string;
}

const Heading1 = ({ children, className }: Heading1Props) => {
  return (
    <>
      <h1 className={`${className} text-base`}>{children}</h1>
    </>
  );
};

export default Heading1;
