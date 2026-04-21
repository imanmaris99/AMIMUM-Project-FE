"use client";

import ButtonSpinner from "@/components/ui/ButtonSpinner";
import rupiahFormater from "@/utils/rupiahFormater";

interface OrderSubmitSectionProps {
  isLoading: boolean;
  isDisabled: boolean;
  totalAmount: number;
  submitLabel: string;
  onSubmit: () => void;
}

const OrderSubmitSection = ({
  isLoading,
  isDisabled,
  totalAmount,
  submitLabel,
  onSubmit,
}: OrderSubmitSectionProps) => {
  return (
    <div className="px-4 py-6 bg-white sticky bottom-0">
      <button
        onClick={onSubmit}
        disabled={isDisabled}
        className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
          isDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-primary text-white hover:bg-primary/90 active:scale-95"
        }`}
      >
        {isLoading ? (
          <ButtonSpinner size="md" color="white" text="Memproses..." />
        ) : (
          `${submitLabel} ${rupiahFormater(totalAmount)}`
        )}
      </button>

      {isDisabled && !isLoading && (
        <p className="text-center text-sm text-gray-500 mt-2">
          Keranjang kosong, tidak dapat melanjutkan pembayaran
        </p>
      )}
    </div>
  );
};

export default OrderSubmitSection;
