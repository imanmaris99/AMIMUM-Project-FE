import React from "react";
import RightArrow from "./RightArrow";

interface TransactionHistoryCardProps {
  data: {
    id: string;
    date: string;
    status: "Batal" | "Lunas" | "Pending" | "Refund";
  };
}

const TransactionHistoryCard = ({ data }: TransactionHistoryCardProps) => {
  let buttonStyle = "";

  switch (data.status) {
    case "Batal":
      buttonStyle = "bg-[#E14640] text-[#E14640]";
      break;
    case "Lunas":
      buttonStyle = "bg-[#40E146] text-[#40E146]";
      break;
    case "Pending":
      buttonStyle = "bg-[#FFC107] text-[#FFC107]";
      break;
    case "Refund":
      buttonStyle = "bg-[#E792FD] text-[#E792FD]";
      break;
    default:
      break;
  }
  return (
    <li className="h-[86px] flex items-center px-3 justify-between border-b-2">
      <div className="w-[180px]">
        <h2 className="font-semibold text-sm text-[#313131]">Id: {data.id}</h2>
        <h3 className="text-xs text-[#A2A2A2]">{data.date}</h3>
      </div>
      <button
        className={`${buttonStyle} text-sm font-semibold bg-opacity-15 h-[33px] w-[75px] rounded-md`}
      >
        {data.status}
      </button>
      <RightArrow />
    </li>
  );
};

export default TransactionHistoryCard;
