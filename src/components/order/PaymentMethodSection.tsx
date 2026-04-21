"use client";

import { IoCheckmarkCircle } from "react-icons/io5";
import { PaymentMethodGroup } from "@/lib/paymentMethods";
import { TransactionPaymentMethod } from "@/types/transaction";

interface PaymentMethodSectionProps {
  paymentMethodGroups: PaymentMethodGroup[];
  expandedPaymentGroups: Record<string, boolean>;
  selectedPaymentMethod: TransactionPaymentMethod | null;
  paymentError?: string;
  onToggleGroup: (groupId: string) => void;
  onSelectPaymentMethod: (method: TransactionPaymentMethod) => void;
}

const renderPaymentBadge = (badge: string, isAvailable: boolean) => (
  <div
    className={`flex h-10 w-10 items-center justify-center rounded-xl text-[10px] font-semibold ${
      isAvailable ? "bg-[#F4F0E8] text-[#6B4E2E]" : "bg-gray-100 text-gray-400"
    }`}
  >
    {badge}
  </div>
);

const PaymentMethodSection = ({
  paymentMethodGroups,
  expandedPaymentGroups,
  selectedPaymentMethod,
  paymentError,
  onToggleGroup,
  onSelectPaymentMethod,
}: PaymentMethodSectionProps) => {
  return (
    <div className="px-4 py-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Metode Pembayaran</h2>
      <div className="space-y-4">
        {paymentMethodGroups.map((group) => (
          <div key={group.id} className="overflow-hidden rounded-2xl border border-gray-200">
            <button
              type="button"
              onClick={() => onToggleGroup(group.id)}
              className="flex w-full items-center justify-between bg-[#FAF7F2] px-4 py-3 text-left"
            >
              <span className="text-base font-semibold text-[#0D0E09]">{group.title}</span>
              <span className="text-lg text-gray-500">
                {expandedPaymentGroups[group.id] ? "−" : "+"}
              </span>
            </button>
            {expandedPaymentGroups[group.id] && (
              <div className="divide-y divide-gray-100 bg-white">
                {group.methods.map((method) => {
                  const isSelected = selectedPaymentMethod === method.id;

                  return (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 px-4 py-4 transition-all ${
                        method.isAvailable
                          ? "cursor-pointer hover:bg-gray-50"
                          : "cursor-not-allowed opacity-60"
                      } ${isSelected ? "bg-primary/5" : ""}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={isSelected}
                        disabled={!method.isAvailable}
                        onChange={() => onSelectPaymentMethod(method.id)}
                        className="sr-only"
                      />
                      {renderPaymentBadge(method.badge, method.isAvailable)}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                      <div
                        className={`h-6 w-6 rounded-full border-2 ${
                          isSelected ? "border-primary bg-primary" : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && <IoCheckmarkCircle className="h-5 w-5 text-white" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      {paymentError && <p className="text-red-500 text-xs mt-2">{paymentError}</p>}
    </div>
  );
};

export default PaymentMethodSection;
