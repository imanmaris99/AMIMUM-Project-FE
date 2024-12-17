import React from "react";
import Image from "next/image";

const BottomBar = () => {
  return (
    <>
      <div className="h-5 bg-white flex justify-center">
        <Image src={"/cart/taskbar.svg"} alt="" width={134} height={5} />
      </div>
    </>
  );
};

export default BottomBar;
