"use client";

import HorizontalLinearAlternativeLabelStepper from "./Stepper";
import ReceiverForm from "./ReceiverForm";
import PackageSpecificationForm from "./PackageSpecificationForm";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { GoLocation } from "react-icons/go";
import { ReceiverFormData, PackageFormData } from "@/types/shipment";
import { getMyShipments } from "@/services/api/shipment";
import { getOwnerShipmentAddress } from "@/services/api/shipment-address";
import LoginProtection from "@/components/common/LoginProtection";

interface StoreAddressInfo {
  name: string;
  phone: string;
  address: string;
  cityId?: string;
}

const customerShipmentSteps = ["Alamat Tujuan", "Paket & Ongkir"];

const EditShipment = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shipmentId = searchParams?.get('shipmentId');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [storeAddress, setStoreAddress] = useState<StoreAddressInfo | null>(null);
  const [isStoreAddressLoading, setIsStoreAddressLoading] = useState(true);
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
      } catch {
        toast.error("Alamat toko belum bisa dimuat. Silakan coba lagi beberapa saat lagi.");
        setStoreAddress(null);
      } finally {
        setIsStoreAddressLoading(false);
      }
    };

    loadStoreAddress();
  }, []);

  useEffect(() => {
    const loadShipment = async () => {
      if (!shipmentId) {
        return;
      }

      try {
        const response = await getMyShipments();
        const existingShipment = response.data.find((shipment) => shipment.id === shipmentId);

        if (!existingShipment) {
          toast.error("Data pengiriman ini belum tersedia. Silakan kembali dan pilih alamat lain.");
          return;
        }

        setReceiverData({
          receiverName: existingShipment.my_address.name,
          phoneNumber: existingShipment.my_address.phone,
          country: existingShipment.my_address.country || "",
          province: existingShipment.my_address.state || "",
          city: existingShipment.my_address.city || "",
          cityId: existingShipment.my_address.city_id?.toString() || "",
          postalCode: existingShipment.my_address.zip_code?.toString() || "",
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
      } catch {
        toast.error("Detail pengiriman belum bisa dimuat. Silakan coba lagi beberapa saat lagi.");
      }
    };

    loadShipment();
  }, [shipmentId]);

  const handleReceiverSubmit = (data: ReceiverFormData) => {
    setReceiverData(data);
    setCurrentStep(1);
  };

  const handlePackageSubmit = async (data: PackageFormData) => {
    setPackageData(data);
    toast.error("Fitur ubah pengiriman belum tersedia. Hapus data pengiriman lama lalu buat pengiriman baru jika perlu mengganti alamat atau ongkir.");
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
    <div className="min-h-screen pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      <section className="mx-4 mt-4 rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-100">
        <div className="relative flex items-center justify-center">
          <button 
            onClick={handleBack}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-[#006A47] transition-colors hover:bg-emerald-100"
            aria-label="Kembali"
            type="button"
          >
            ←
          </button>
          <div className="max-w-[280px] px-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Delivery checkout</p>
            <h1 className="mt-1 text-lg font-bold text-[#0D0E09]">
              {shipmentId ? 'Edit Alamat Tujuan' : 'Tambah Alamat Tujuan'}
            </h1>
            <p className="mt-1 text-xs leading-5 text-[#6B7C73]">
              Customer hanya mengatur alamat penerima. Alamat toko dikelola admin.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-4 w-full max-w-[420px] px-4">
        <div className="rounded-3xl border border-emerald-100 bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
          <div className="flex items-start gap-3">
            <GoLocation className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900">Alamat toko</p>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-primary">
                  Info pengirim
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                Alamat ini hanya informasi asal pengiriman dan tidak bisa diedit oleh customer.
              </p>
              <div className="mt-3 rounded-2xl bg-emerald-50/70 p-3 text-xs text-gray-700">
                {isStoreAddressLoading ? (
                  <p>Memuat alamat toko...</p>
                ) : storeAddress ? (
                  <>
                    <p className="font-semibold text-gray-900">{storeAddress.name}</p>
                    <p>{storeAddress.phone}</p>
                    <p className="mt-1 leading-relaxed">{storeAddress.address || "Alamat toko belum lengkap"}</p>
                    {!storeAddress.cityId && (
                      <p className="mt-2 rounded-lg bg-yellow-50 px-3 py-2 font-medium text-yellow-700">
                        Kota RajaOngkir alamat toko belum valid. Hubungi admin toko.
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

      <div className="mt-5 flex items-center justify-center pb-4">
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
    </div>
    </LoginProtection>
  );
};

export default EditShipment;
