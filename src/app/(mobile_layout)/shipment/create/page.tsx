"use client";

import HorizontalLinearAlternativeLabelStepper from "../edit/Stepper";
import ReceiverForm from "../edit/ReceiverForm";
import PackageSpecificationForm from "../edit/PackageSpecificationForm";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { GoLocation } from "react-icons/go";
import { ReceiverFormData, PackageFormData } from "@/types/shipment";
import { createShipment } from "@/services/api/shipment";
import { getOwnerShipmentAddress } from "@/services/api/shipment-address";
import LoginProtection from "@/components/common/LoginProtection";

interface StoreAddressInfo {
  name: string;
  phone: string;
  address: string;
  cityId?: string;
}

const customerShipmentSteps = ["Alamat Tujuan", "Paket & Ongkir"];

const getSafeReturnPath = (value: string | null) => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/shipment";
  }

  return value;
};

const CreateShipment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = useMemo(
    () => getSafeReturnPath(searchParams?.get("returnTo") ?? null),
    [searchParams]
  );
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isStoreAddressLoading, setIsStoreAddressLoading] = useState(true);
  const [storeAddress, setStoreAddress] = useState<StoreAddressInfo | null>(null);
  const [receiverData, setReceiverData] = useState<ReceiverFormData | null>(null);
  const [packageData, setPackageData] = useState<PackageFormData | null>(null);

  useEffect(() => {
    const loadStoreAddress = async () => {
      setIsStoreAddressLoading(true);
      try {
        const response = await getOwnerShipmentAddress();
        const ownerAddress = response.data;

        setStoreAddress({
          name: ownerAddress.name || "Alamat toko",
          phone: ownerAddress.phone || "-",
          cityId: ownerAddress.city_id?.toString(),
          address: [
            ownerAddress.address,
            ownerAddress.city,
            ownerAddress.state,
            ownerAddress.zip_code,
            ownerAddress.country,
          ]
            .filter(Boolean)
            .join(", "),
        });
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Gagal mengambil alamat toko."
        );
        setStoreAddress(null);
      } finally {
        setIsStoreAddressLoading(false);
      }
    };

    loadStoreAddress();
  }, []);

  const handleReceiverSubmit = (data: ReceiverFormData) => {
    setReceiverData(data);
    setCurrentStep(1);
  };

  const handlePackageSubmit = async (data: PackageFormData) => {
    setPackageData(data);
    setIsLoading(true);
    
    try {
      if (!receiverData) {
        throw new Error("Data penerima belum lengkap.");
      }

      if (!storeAddress?.cityId) {
        throw new Error("Alamat toko belum memiliki kota RajaOngkir yang valid. Hubungi admin toko.");
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

      toast.success("Alamat tujuan dan ongkir berhasil disimpan.");
      router.push(returnTo === "/shipment" ? "/shipment?created=true" : returnTo);
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
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleBack = () => {
    if (currentStep > 0) {
      handlePreviousStep();
      return;
    }

    router.back();
  };

  return (
    <LoginProtection useModal={true} feature="general">
    <div>
      <div className="flex justify-center items-center relative mt-16 px-6">
        <div className="absolute left-10">
          <button 
            onClick={handleBack}
            className="text-3xl cursor-pointer hover:text-primary transition-colors"
            aria-label="Kembali"
          >
            ←
          </button>
        </div>
        <div className="text-center max-w-[280px]">
          <h1 className="text-[16px] font-semibold">Tambah Alamat Tujuan</h1>
          <p className="text-xs text-gray-500 mt-1">
            Customer hanya mengisi alamat penerima. Alamat toko dikelola admin.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-[420px] px-6">
        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <GoLocation className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900">Alamat toko</p>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-primary">
                  Info pengirim
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                Alamat ini dipakai sebagai asal pengiriman dan hanya dapat diedit oleh admin toko.
              </p>
              <div className="mt-3 rounded-xl bg-white p-3 text-xs text-gray-700">
                {isStoreAddressLoading ? (
                  <p>Memuat alamat toko...</p>
                ) : storeAddress ? (
                  <>
                    <p className="font-semibold text-gray-900">{storeAddress.name}</p>
                    <p>{storeAddress.phone}</p>
                    <p className="mt-1 leading-relaxed">{storeAddress.address || "Alamat toko belum lengkap"}</p>
                    {!storeAddress.cityId && (
                      <p className="mt-2 rounded-lg bg-yellow-50 px-3 py-2 font-medium text-yellow-700">
                        Kota RajaOngkir alamat toko belum valid. Customer belum bisa menghitung ongkir.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="font-medium text-red-600">
                    Alamat toko belum tersedia. Hubungi admin toko.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center mt-6 pb-4">
        <HorizontalLinearAlternativeLabelStepper
          currentStep={currentStep}
          steps={customerShipmentSteps}
        />
      </div>

      <div className="flex justify-center items-center">
        {currentStep === 0 && (
          <ReceiverForm 
            onSubmit={handleReceiverSubmit}
            onBack={handleBack}
            initialData={receiverData || undefined}
          />
        )}
        {currentStep === 1 && (
          <PackageSpecificationForm 
            onSubmit={handlePackageSubmit}
            onBack={handlePreviousStep}
            initialData={packageData || undefined}
            originCityId={storeAddress?.cityId}
            destinationCityId={receiverData?.cityId}
          />
        )}
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-gray-600">Menyimpan alamat tujuan...</p>
          </div>
        </div>
      )}
    </div>
    </LoginProtection>
  );
};

export default CreateShipment;
