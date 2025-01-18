import TransactionHistoryCard from "@/components/transaction-history/TransactionHistoryCard";
import React from "react";

const dummyData = [
  {
    id: 456789351,
    date: "Sep 9, 2024, 04:30pm",
    status: "Batal",
  },
  {
    id: 456789351,
    date: "Sep 9, 2024, 04:30pm",
    status: "Lunas",
  },
  {
    id: 456789351,
    date: "Sep 9, 2024, 04:30pm",
    status: "Pending",
  },
  {
    id: 456789351,
    date: "Sep 9, 2024, 04:30pm",
    status: "Refund",
  },
];

const TransactionHistory = () => {
  return (
    <div className="bg-black">
      <main className="flex flex-col w-[375px] mx-auto bg-[#FAFAFA]">
        <div className="p-6">
          <ol className="">
            {dummyData.map((transactionItem) => (
              <TransactionHistoryCard
                key={transactionItem.id}
                data={transactionItem}
              />
            ))}
          </ol>
        </div>
      </main>
    </div>
  );
};

export default TransactionHistory;
