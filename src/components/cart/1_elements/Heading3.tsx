import React, { ReactNode } from "react";

interface Heading3Props {
  children: ReactNode;
  className?: string;
}

const Heading3 = ({ children, className }: Heading3Props) => {
  return (
    <>
      <p className={`${className} text-xs`}>{children}</p>
    </>
  );
};

export default Heading3;
