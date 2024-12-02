import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const BackArrow = () => {
  const router = useRouter();

  return (
    <div className="w-1/3 flex self-end pl-5">
      <Image
        src={"/cart/leftarrow.svg"}
        alt="Back to the previous page"
        width={32}
        height={32}
        onClick={router.back}
        className="cursor-pointer"
      />
    </div>
  );
};

export default BackArrow;
