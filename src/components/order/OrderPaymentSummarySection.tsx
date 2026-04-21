"use client";

import rupiahFormater from "@/utils/rupiahFormater";
import { CheckoutTotals } from "./orderPageUtils";

interface OrderPaymentSummarySectionProps {
  itemCount: number;
  deliveryMethod: "delivery" | "pickup";
  totals: CheckoutTotals;
}

const OrderPaymentSummarySection = ({
  itemCount,
  deliveryMethod,
  totals,
}: OrderPaymentSummarySectionProps) => {
  return (
    <div className="px-4 py-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pembayaran</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal ({itemCount} item)</span>
          <span className="font-medium">{rupiahFormater(totals.subtotal)}</span>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Diskon</span>
            <span className="font-medium text-red-500">-{rupiahFormater(totals.discount)}</span>
          </div>
        )}
        {deliveryMethod === "delivery" && totals.shipping > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Ongkir</span>
            <span className="font-medium">{rupiahFormater(totals.shipping)}</span>
          </div>
        )}
        {deliveryMethod === "pickup" && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Pengambilan</span>
            <span className="font-medium text-green-600">Gratis</span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total</span>
            <span className="text-primary">{rupiahFormater(totals.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentSummarySection;
