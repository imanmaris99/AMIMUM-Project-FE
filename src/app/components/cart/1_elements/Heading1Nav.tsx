import React, { ReactNode } from "react";

interface Heading1NavProps {
  children: ReactNode;
}

const Heading1Nav = ({ children }: Heading1NavProps) => {
  return (
    <div className="w-1/3 flex justify-center self-end pb-1">
      <h1 className="">{children}</h1>
    </div>
  );
};

export default Heading1Nav;
