"use client";

import HorizontalLinearAlternativeLabelStepper from "./Stepper";
import SenderForm from "./SenderForm";
import ReceiverForm from "./ReceiverForm";
import PackageSpecificationForm from "./PackageSpecificationForm";
import { useState } from "react";

const EditShipment = () => {
  const [currentStep, setCurrentStep] = useState(0);

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
        <h1 className="text-[16px] font-semibold">Alamat Pengiriman</h1>
      </div>

      <div className="flex justify-center items-center mt-10 pb-4">
        <HorizontalLinearAlternativeLabelStepper currentStep={currentStep} />
      </div>

      <div className="flex justify-center items-center">
        {currentStep === 0 && <SenderForm onSubmit={handleNextStep} />}
        {currentStep === 1 && <ReceiverForm onSubmit={handleNextStep} onBack={handlePreviousStep} />}
        {currentStep === 2 && <PackageSpecificationForm onSubmit={handleNextStep} onBack={handlePreviousStep} />}
      </div>
    </div>
  );
};

export default EditShipment;
