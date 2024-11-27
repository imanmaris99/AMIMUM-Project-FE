import React, { ReactNode } from "react";

interface Heading3Props {
  children: ReactNode;
  className?: string;
}

const Heading3 = ({ children, className }: Heading3Props) => {
  return <h3 className={`${className} text-xs`}>{children}</h3>;
};

export default Heading3;
