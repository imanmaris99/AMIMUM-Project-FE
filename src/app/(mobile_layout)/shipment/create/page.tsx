"use client";

import HorizontalLinearAlternativeLabelStepper from "../edit/Stepper";
import SenderForm from "../edit/SenderForm";
import ReceiverForm from "../edit/ReceiverForm";
import PackageSpecificationForm from "../edit/PackageSpecificationForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const CreateShipment = () => {
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSenderSubmit = () => {
    setCurrentStep(1);
  };

  const handleReceiverSubmit = () => {
    setCurrentStep(2);
  };

  const handlePackageSubmit = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push("/shipment?created=true");
    } catch {
      toast.error("Gagal membuat alamat pengiriman. Silakan coba lagi.");
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
          />
        )}
        {currentStep === 1 && (
          <ReceiverForm 
            onSubmit={handleReceiverSubmit} 
            onBack={handlePreviousStep}
          />
        )}
        {currentStep === 2 && (
          <PackageSpecificationForm 
            onSubmit={handlePackageSubmit} 
            onBack={handlePreviousStep}
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
