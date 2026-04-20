"use client";

import HorizontalLinearAlternativeLabelStepper from "../edit/Stepper";
import SenderForm from "../edit/SenderForm";
import ReceiverForm from "../edit/ReceiverForm";
import PackageSpecificationForm from "../edit/PackageSpecificationForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { SenderFormData, ReceiverFormData, PackageFormData } from "@/types/shipment";
import { createShipment } from "@/services/api/shipment";

const CreateShipment = () => {
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [senderData, setSenderData] = useState<SenderFormData | null>(null);
  const [receiverData, setReceiverData] = useState<ReceiverFormData | null>(null);
  const [packageData, setPackageData] = useState<PackageFormData | null>(null);

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
    setIsLoading(true);
    
    try {
      if (!receiverData) {
        throw new Error("Data penerima belum lengkap.");
      }

      await createShipment({
        address: {
          name: receiverData.receiverName,
          phone: receiverData.phoneNumber,
          address: receiverData.fullAddress,
          city: receiverData.city,
          city_id: Number(receiverData.cityId),
          state: receiverData.province,
          country: receiverData.country,
          zip_code: Number(receiverData.postalCode),
        },
        courier: {
          courier_name: data.courier,
          weight: data.weight,
          length: data.length,
          width: data.width,
          height: data.height,
          service_type: data.serviceType,
          cost: data.cost,
          estimated_delivery: data.estimatedDelivery,
        },
      });

      toast.success("Alamat pengiriman berhasil dibuat.");
      router.push("/shipment?created=true");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal membuat alamat pengiriman. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-[16px] font-semibold">Tambah Alamat Pengiriman</h1>
          <p className="text-xs text-gray-500 mt-1">Buat alamat pengiriman baru</p>
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

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-gray-600">Menyimpan alamat pengiriman...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateShipment;
