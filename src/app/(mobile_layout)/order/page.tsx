import React from "react";

const Order = () => {
  return <main>Order</main>;
};

const OrderSkeleton = () => (
  <main className="max-w-md mx-auto mt-10 animate-pulse">
    <div className="h-6 w-1/2 bg-gray-300 rounded mb-4" />
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-4 w-full bg-gray-300 rounded" />
      ))}
    </div>
  </main>
);

export default Order;
