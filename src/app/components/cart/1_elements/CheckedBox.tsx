import React from "react";
import Image from "next/image";

interface CheckedBoxProps {
  onClick: () => void;
}

const CheckedBox = ({ onClick }: CheckedBoxProps) => {
  return (
    <>
      <Image
        src={"/cart/checkedbox.svg"}
        alt=""
        width={24}
        height={24}
        onClick={onClick}
        className="cursor-pointer"
      />
    </>
  );
};

export default CheckedBox;
