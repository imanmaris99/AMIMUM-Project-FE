"use client";

import HorizontalLinearAlternativeLabelStepper from "./Stepper";
import SenderForm from "./SenderForm";
import ReceiverForm from "./ReceiverForm";
import PackageSpecificationForm from "./PackageSpecificationForm";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { SenderFormData, ReceiverFormData, PackageFormData } from "@/types/shipment";
import { dummyShipments } from "@/data/shipmentDummyData";

const EditShipment = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shipmentId = searchParams?.get('shipmentId');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [senderData, setSenderData] = useState<SenderFormData | null>(null);
  const [receiverData, setReceiverData] = useState<ReceiverFormData | null>(null);
  const [packageData, setPackageData] = useState<PackageFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Load data existing jika edit
  useEffect(() => {
    if (shipmentId) {
      const existingShipment = dummyShipments.find(s => s.id === shipmentId);
      if (existingShipment) {
        // Convert existing data to form data
        setSenderData({
          senderName: "Toko Amimum", // Data toko
          phoneNumber: "+6281234567890",
          country: "Indonesia",
          province: "DKI Jakarta",
          city: "Jakarta Selatan",
          cityId: "126",
          postalCode: "12530",
          fullAddress: "Jl. Raya Industri No. 88, Kawasan Industri"
        });
        
        setReceiverData({
          receiverName: existingShipment.address.name,
          phoneNumber: existingShipment.address.phone,
          country: existingShipment.address.country || '',
          province: existingShipment.address.state || '',
          city: existingShipment.address.city || '',
          cityId: existingShipment.address.city_id?.toString() || '',
          postalCode: existingShipment.address.zip_code?.toString() || '',
          fullAddress: existingShipment.address.address || ''
        });
        
        setPackageData({
          courier: existingShipment.courier.courier_name.toLowerCase(),
          weight: existingShipment.courier.weight || 0,
          length: 30, // Default values
          width: 20,
          height: 10,
          serviceType: existingShipment.courier.service_type || '',
          cost: existingShipment.courier.cost || 0,
          estimatedDelivery: existingShipment.courier.estimated_delivery || ''
        });
      }
    }
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
    setIsLoading(true);
    
    try {
      // Simulasi API call untuk update shipment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulasi data shipment yang diupdate
      // const updatedShipment = { // Removed unused variable
      //   id: shipmentId,
      //   sender: senderData,
      //   receiver: receiverData,
      //   package: data,
      //   updatedAt: new Date().toISOString()
      // };
      
      
      // Show success message
      setShowSuccessMessage(true);
      
      // Redirect ke halaman shipment setelah 2 detik
      setTimeout(() => {
        router.push("/shipment?updated=true");
      }, 2000);
      
    } catch {
      toast.error("Gagal mengupdate alamat pengiriman. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleNextStep = (event: React.FormEvent) => { // Removed unused function
  //   event.preventDefault();
  //   setCurrentStep((prevStep) => prevStep + 1);
  // };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Alamat pengiriman berhasil diupdate!</span>
          </div>
        </div>
      )}

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
          />
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-gray-600">Mengupdate alamat pengiriman...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditShipment;
