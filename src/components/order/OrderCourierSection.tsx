"use client";

import { CourierCompany } from "@/types/shipment";
import CourierSelector from "./CourierSelector";

interface OrderCourierSectionProps {
  courierCompanies: CourierCompany[];
  selectedCourierCompany: string;
  selectedCourierService: string;
  isLoading: boolean;
  courierError?: string;
  onCompanySelect: (companyId: string) => void;
  onServiceSelect: (serviceId: string) => void;
}

const OrderCourierSection = ({
  courierCompanies,
  selectedCourierCompany,
  selectedCourierService,
  isLoading,
  courierError,
  onCompanySelect,
  onServiceSelect,
}: OrderCourierSectionProps) => {
  return (
    <div className="px-4 py-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Pilih Kurir</h2>
      <CourierSelector
        courierCompanies={courierCompanies}
        selectedCompany={selectedCourierCompany}
        selectedService={selectedCourierService}
        onCompanySelect={onCompanySelect}
        onServiceSelect={onServiceSelect}
        isLoading={isLoading}
      />
      {courierError && <p className="text-red-500 text-xs mt-2">{courierError}</p>}
    </div>
  );
};

export default OrderCourierSection;
