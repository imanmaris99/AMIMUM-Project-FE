import React, { ReactNode } from "react";

interface Heading1NavProps {
  children: ReactNode;
}

const Heading1Nav = ({ children }: Heading1NavProps) => {
  return (
    <div className="w-1/3 flex justify-center self-end pb-1">
      <p className="">{children}</p>
    </div>
  );
};

export default Heading1Nav;
