import React from "react";
import Image from "next/image";

interface EmptyCheckBoxProps {
  onClick: () => void;
}

const EmptyCheckBox = ({ onClick }: EmptyCheckBoxProps) => {
  return (
    <>
      <Image
        src={"/cart/checkbox.svg"}
        alt=""
        width={24}
        height={24}
        onClick={onClick}
      />
    </>
  );
};

export default EmptyCheckBox;
