"use client";

import HorizontalLinearAlternativeLabelStepper from "./Stepper";
import SenderForm from "./SenderForm";
import ReceiverForm from "./ReceiverForm";
import PackageSpecificationForm from "./PackageSpecificationForm";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SenderFormData, ReceiverFormData, PackageFormData } from "@/types/shipment";
import { dummyShipments } from "@/data/shipmentDummyData";

const EditShipment = () => {
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get('shipmentId');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [senderData, setSenderData] = useState<SenderFormData | null>(null);
  const [receiverData, setReceiverData] = useState<ReceiverFormData | null>(null);
  const [packageData, setPackageData] = useState<PackageFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
          country: existingShipment.address.country,
          province: existingShipment.address.state,
          city: existingShipment.address.city,
          cityId: existingShipment.address.cityId.toString(),
          postalCode: existingShipment.address.zipCode,
          fullAddress: existingShipment.address.address
        });
        
        setPackageData({
          courier: existingShipment.courier.courierName.toLowerCase(),
          weight: existingShipment.courier.weight,
          length: 30, // Default values
          width: 20,
          height: 10,
          serviceType: existingShipment.courier.serviceType,
          cost: existingShipment.courier.cost,
          estimatedDelivery: existingShipment.courier.estimatedDelivery
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

  const handlePackageSubmit = (data: PackageFormData) => {
    setPackageData(data);
    // Simulasi save data
    console.log("Shipment Data:", {
      sender: senderData,
      receiver: receiverData,
      package: data
    });
    // Redirect ke halaman shipment
  };

  const handleNextStep = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div>
      <div className="flex justify-center items-center relative mt-16">
        <h1 className="text-[16px] font-semibold">
          {shipmentId ? 'Edit Alamat Pengiriman' : 'Tambah Alamat Pengiriman'}
        </h1>
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
    </div>
  );
};

export default EditShipment;
