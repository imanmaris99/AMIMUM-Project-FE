import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";

const HeaderRegister = () => {
  return (
    <div className="bg-customGreen4 pb-1 rounded-b-2xl h-1/4">
      <Image src="/brand-header.png" height={500} width={500} alt="header logo" className="w-10/12 py-10 mx-auto" />
      <Separator className="bg-primary mt-5 mb-1 py-1 w-2/5 mx-auto rounded-xl"/>
    </div>
  );
};

export default HeaderRegister;
