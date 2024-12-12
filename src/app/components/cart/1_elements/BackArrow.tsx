import React from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

const BackArrow = () => {
  const router = useRouter();

  return (
    <div className="w-1/3 flex self-end pl-5">
      <IoChevronBack
        className="text-3xl cursor-pointer"
        onClick={router.back}
      />
    </div>
  );
};

export default BackArrow;
