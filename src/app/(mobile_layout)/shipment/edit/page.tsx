"use client";

import HorizontalLinearAlternativeLabelStepper from "./Stepper";
import SenderForm from "./SenderForm";
import ReceiverForm from "./ReceiverForm";
import PackageSpecificationForm from "./PackageSpecificationForm";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { SenderFormData, ReceiverFormData, PackageFormData } from "@/types/shipment";
import { getMyShipments } from "@/services/api/shipment";

const EditShipment = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shipmentId = searchParams?.get('shipmentId');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [senderData, setSenderData] = useState<SenderFormData | null>(null);
  const [receiverData, setReceiverData] = useState<ReceiverFormData | null>(null);
  const [packageData, setPackageData] = useState<PackageFormData | null>(null);

  useEffect(() => {
    const loadShipment = async () => {
      if (!shipmentId) {
        return;
      }

      try {
        const response = await getMyShipments();
        const existingShipment = response.data.find((shipment) => shipment.id === shipmentId);

        if (!existingShipment) {
          toast.error("Data shipment tidak ditemukan.");
          return;
        }

        setReceiverData({
          receiverName: existingShipment.my_address.name,
          phoneNumber: existingShipment.my_address.phone,
          country: "",
          province: "",
          city: "",
          cityId: "",
          postalCode: "",
          fullAddress: existingShipment.my_address.address || "",
        });

        setPackageData({
          courier: existingShipment.my_courier.courier_name.toLowerCase(),
          weight: existingShipment.my_courier.weight || 0,
          length: 0,
          width: 0,
          height: 0,
          serviceType: existingShipment.my_courier.service_type || "",
          cost: existingShipment.my_courier.cost || 0,
          estimatedDelivery: existingShipment.my_courier.estimated_delivery || "",
        });
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Gagal mengambil detail shipment."
        );
      }
    };

    loadShipment();
  }, [shipmentId]);

  const handleSenderSubmit = (data: SenderFormData) => {
    setSenderData(data);
    setCurrentStep(1);
  };

  const handleReceiverSubmit = (data: ReceiverFormData) => {
    setReceiverData(data);
    setCurrentStep(2);
  };

  const handlePackageSubmit = async (data: PackageFormData) => {
    setPackageData(data);
    toast.error("Endpoint update shipment belum tersedia, jadi data belum dapat disimpan.");
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <div className="flex justify-center items-center relative mt-16">
        <div className="absolute left-10">
          <button 
            onClick={handleBack}
            className="text-3xl cursor-pointer hover:text-primary transition-colors"
          >
            ←
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-[16px] font-semibold">
            {shipmentId ? 'Edit Alamat Pengiriman' : 'Tambah Alamat Pengiriman'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {shipmentId ? 'Edit alamat pengiriman existing' : 'Buat alamat pengiriman baru'}
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center mt-10 pb-4">
        <HorizontalLinearAlternativeLabelStepper currentStep={currentStep} />
      </div>

      <div className="flex justify-center items-center">
        {currentStep === 0 && (
          <SenderForm 
            onSubmit={handleSenderSubmit} 
            initialData={senderData || undefined}
          />
        )}
        {currentStep === 1 && (
          <ReceiverForm 
            onSubmit={handleReceiverSubmit} 
            onBack={handlePreviousStep}
            initialData={receiverData || undefined}
          />
        )}
        {currentStep === 2 && (
          <PackageSpecificationForm 
            onSubmit={handlePackageSubmit} 
            onBack={handlePreviousStep}
            initialData={packageData || undefined}
            originCityId={senderData?.cityId}
            destinationCityId={receiverData?.cityId}
          />
        )}
      </div>
    </div>
  );
};

export default EditShipment;
