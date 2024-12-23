import React, { ReactNode } from "react";
import BackArrow from "../1_elements/BackArrow";
import Heading1Nav from "../1_elements/Heading1Nav";



interface TopNavigationProps {
  children: ReactNode;
}

const TopNavigation = ({ children }: TopNavigationProps) => {
  return (
    <div className="fixed top-0 right-0 left-0 max-w-[400px] w-full mx-auto bg-white h-[106px] flex p-4 z-40">
      <BackArrow />
      

      <Heading1Nav>{children}</Heading1Nav>
      <div className="w-1/3"></div>
    </div>
  );
};

export default TopNavigation;
