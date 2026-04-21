"use client";

import Image from "next/image";
import { GoPackage } from "react-icons/go";
import { CartItemType } from "@/types/apiTypes";
import rupiahFormater from "@/utils/rupiahFormater";

interface OrderItemsSectionProps {
  items: CartItemType[];
  title: string;
  onStartShopping: () => void;
}

const OrderItemsSection = ({ items, title, onStartShopping }: OrderItemsSectionProps) => {
  return (
    <div className="px-4 py-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      {items.length === 0 ? (
        <div className="text-center py-8">
          <GoPackage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Keranjang kosong</p>
          <button
            onClick={onStartShopping}
            className="mt-2 text-primary font-medium text-sm hover:underline"
          >
            Mulai belanja
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                <Image
                  src={item.image || "/default-image.jpg"}
                  alt={item.product_name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">{item.product_name}</h3>
                <p className="text-xs text-gray-600">{item.variant_name}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm font-medium text-gray-900">
                    {rupiahFormater(item.price)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                <p className="font-medium text-gray-900 text-sm">
                  {rupiahFormater(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderItemsSection;
