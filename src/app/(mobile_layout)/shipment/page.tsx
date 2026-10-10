"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { ShipmentData } from "@/types/shipment";
import {
  activateShipment,
  deleteShipment,
  getMyShipments,
  ShipmentListItem,
} from "@/services/api/shipment";
import { toast } from "react-hot-toast";
import LoginProtection from "@/components/common/LoginProtection";

const mapShipmentToViewModel = (shipment: ShipmentListItem): ShipmentData => ({
  id: shipment.id,
  address: {
    id: shipment.my_address.id,
    name: shipment.my_address.name,
    phone: shipment.my_address.phone,
    address: shipment.my_address.address,
    city: shipment.my_address.city,
    city_id: shipment.my_address.city_id,
    state: shipment.my_address.state,
    country: shipment.my_address.country,
    zip_code: shipment.my_address.zip_code,
    created_at: shipment.my_address.created_at || shipment.created_at,
  },
  courier: {
    id: shipment.my_courier.id,
    courier_name: shipment.my_courier.courier_name,
    weight: shipment.my_courier.weight,
    service_type: shipment.my_courier.service_type,
    cost: shipment.my_courier.cost,
    estimated_delivery: shipment.my_courier.estimated_delivery,
    is_active: shipment.is_active,
    created_at: shipment.my_courier.created_at || shipment.created_at,
  },
  is_active: shipment.is_active,
  created_at: shipment.created_at,
});

const ShipmentSkeleton = () => (
  <div className="min-h-screen animate-pulse px-4 pt-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
    <div className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-100">
      <div className="mx-auto h-3 w-28 rounded-full bg-emerald-100" />
      <div className="mx-auto mt-2 h-5 w-44 rounded-full bg-gray-200" />
      <div className="mx-auto mt-2 h-3 w-56 rounded-full bg-gray-100" />
    </div>
    <div className="mt-4 space-y-4">
      {[...Array(2)].map((_, index) => (
        <div key={index} className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50">
          <div className="flex gap-3">
            <div className="h-7 w-7 rounded-full bg-emerald-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded-full bg-gray-200" />
              <div className="h-4 w-full rounded-full bg-gray-100" />
              <div className="h-4 w-2/3 rounded-full bg-gray-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const formatShipmentAddress = (shipment: ShipmentData) => {
  const parts = [
    shipment.address.address,
    shipment.address.city,
    shipment.address.zip_code ? `Kode Pos ${shipment.address.zip_code}` : "",
    shipment.address.state,
    shipment.address.country,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "Alamat tujuan belum lengkap.";
};

const formatCourierSummary = (shipment: ShipmentData) => {
  const courierName = shipment.courier.courier_name || "Kurir belum tersedia";
  const serviceType = shipment.courier.service_type || "Layanan belum tersedia";
  const cost = shipment.courier.cost && shipment.courier.cost > 0
    ? `Rp ${shipment.courier.cost.toLocaleString()}`
    : "Ongkir belum tersedia";

  return `${courierName} - ${serviceType} | ${cost}`;
};

const Shipment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStates, setActiveStates] = useState<boolean[]>([]);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [shipmentPendingDelete, setShipmentPendingDelete] = useState<ShipmentData | null>(null);

  const refreshShipments = useCallback(async () => {
    const response = await getMyShipments();
    const mappedShipments = response.data.map(mapShipmentToViewModel);

    setShipments(mappedShipments);
    setActiveStates(mappedShipments.map((shipment) => shipment.is_active));
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await refreshShipments();
      } catch {
        toast.error("Data pengiriman belum bisa dimuat. Silakan coba lagi beberapa saat lagi.");
        setShipments([]);
        setActiveStates([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [refreshShipments]);

  // Handle success message dari create/edit page
  useEffect(() => {
    const created = searchParams?.get('created') === 'true';
    const updated = searchParams?.get('updated') === 'true';
    
    if (created) {
      setSuccessMessage("Alamat pengiriman berhasil dibuat!");
      setShowSuccessMessage(true);
    } else if (updated) {
      setSuccessMessage("Alamat pengiriman berhasil diupdate!");
      setShowSuccessMessage(true);
    }
    
    if (created || updated) {
      // Hide message setelah 3 detik
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage("");
        // Remove query parameter
        router.replace('/shipment');
      }, 3000);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!shipmentPendingDelete) {
      return;
    }

    const scrollY = window.scrollY;
    const previousBodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.position = previousBodyStyles.position;
      document.body.style.top = previousBodyStyles.top;
      document.body.style.left = previousBodyStyles.left;
      document.body.style.right = previousBodyStyles.right;
      document.body.style.width = previousBodyStyles.width;
      document.body.style.overflow = previousBodyStyles.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [shipmentPendingDelete]);

  const handleIconClick = async (index: number) => {
    if (activeStates[index]) return;

    setSavingIndex(index);
    const selectedShipment = shipments[index];

    if (!selectedShipment) {
      setSavingIndex(null);
      return;
    }

    try {
      await activateShipment(selectedShipment.id, true);

      setShipments((prev) =>
        prev.map((shipment, currentIndex) => ({
          ...shipment,
          is_active: currentIndex === index,
          courier: {
            ...shipment.courier,
            is_active: currentIndex === index,
          },
        }))
      );
      setActiveStates(
        shipments.map((_, currentIndex) => currentIndex === index)
      );
      toast.success("Alamat utama pengiriman berhasil diperbarui.");
    } catch {
      toast.error("Pilihan pengiriman belum bisa diperbarui. Silakan coba lagi beberapa saat lagi.");
    } finally {
      setSavingIndex(null);
    }
  };

  const handleEdit = (shipmentId: string) => {
    router.push(`/shipment/edit?shipmentId=${shipmentId}`);
  };

  const handleDelete = (shipmentId: string) => {
    const selectedShipment = shipments.find((shipment) => shipment.id === shipmentId);

    if (!selectedShipment) {
      toast.error("Data pengiriman ini belum tersedia. Silakan muat ulang halaman.");
      return;
    }

    setShipmentPendingDelete(selectedShipment);
  };

  const confirmDeleteShipment = async () => {
    if (!shipmentPendingDelete) {
      return;
    }

    const shipmentId = shipmentPendingDelete.id;
    setSavingIndex(shipments.findIndex((shipment) => shipment.id === shipmentId));

    try {
      await deleteShipment(shipmentId);

      const deletedIndex = shipments.findIndex((shipment) => shipment.id === shipmentId);
      const wasActive = activeStates[deletedIndex];
      const remainingShipments = shipments.filter((shipment) => shipment.id !== shipmentId);

      if (wasActive && remainingShipments.length > 0) {
        await activateShipment(remainingShipments[0].id, true);
      }

      await refreshShipments();
      toast.success("Data pengiriman berhasil dihapus.");
      setShipmentPendingDelete(null);
    } catch {
      toast.error("Pengiriman belum bisa dihapus. Silakan coba lagi beberapa saat lagi.");
    } finally {
      setSavingIndex(null);
    }
  };

  const handleAddNew = () => {
    const returnTo = searchParams?.get("returnTo");
    router.push(returnTo ? `/shipment/create?returnTo=${encodeURIComponent(returnTo)}` : "/shipment/create");
  };

  const handleBack = () => {
    router.back();
  };


  if (loading) {
    return <ShipmentSkeleton />;
  }

  return (
    <LoginProtection useModal={true} feature="general">
    <div className="min-h-screen pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        </div>
      )}
      <section className="mx-4 mt-4 rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-100">
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Kembali"
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-[#006A47] transition-colors hover:bg-emerald-100"
          >
            <GoChevronLeft />
          </button>
          <div className="px-12 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Checkout delivery</p>
            <h1 className="mt-1 text-lg font-bold text-[#0D0E09]">Alamat Pengiriman</h1>
            <p className="mt-1 text-xs leading-5 text-[#6B7C73]">Pilih 1 alamat aktif untuk checkout delivery.</p>
          </div>
        </div>
      </section>

      <div className="mt-4 flex flex-col items-center gap-4 px-4">
        {shipments.length === 0 ? (
          <div className="w-full max-w-sm rounded-3xl border border-dashed border-emerald-100 bg-white/95 p-6 text-center shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
            <p className="text-base font-semibold text-[#0D0E09]">Belum ada alamat pengiriman</p>
            <p className="mt-2 text-sm leading-5 text-[#6B7C73]">Tambahkan alamat tujuan dan ongkir untuk dipakai saat checkout delivery.</p>
            <Button 
              onClick={handleAddNew}
              className="mt-5 rounded-2xl bg-primary px-4 py-3 text-white"
            >
              Tambah Alamat
            </Button>
          </div>
        ) : (
          shipments.map((shipment, index) => (
            <div 
              key={shipment.id} 
              className={`flex w-full max-w-sm transform items-start gap-3 rounded-3xl p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] transition-all duration-300 ease-in-out ${
                activeStates[index] ? 'bg-emerald-50 ring-2 ring-primary scale-[1.01]' : 'bg-white/95 ring-1 ring-emerald-50 scale-100'
              }`}
              style={{ minHeight: '120px' }}
            >
              <div onClick={() => handleIconClick(index)} className="flex-shrink-0 mt-1">
                {savingIndex === index ? (
                  <div className="text-2xl text-primary animate-spin">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                ) : activeStates[index] ? (
                  <RiCheckboxCircleLine className="text-2xl cursor-pointer text-primary transition-colors duration-200" />
                ) : (
                  <RiCheckboxBlankCircleLine className="text-2xl cursor-pointer hover:text-primary transition-colors duration-200" />
                )}
              </div>

              <div className="flex flex-col justify-start gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-nowrap min-h-[20px]">
                  <p className="text-xs font-semibold text-gray-800 flex-shrink-0">
                    {[shipment.address.city, shipment.address.state].filter(Boolean).join(", ") || "Kota tujuan belum lengkap"}
                  </p>
                  {savingIndex === index ? (
                    <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 animate-pulse">
                      Menyimpan...
                    </span>
                  ) : activeStates[index] && (
                    <span className="text-xs bg-primary text-white px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                      Alamat Utama
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {formatShipmentAddress(shipment)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatCourierSummary(shipment)}
                </p>
              </div>

              <div className="flex flex-col justify-start items-center gap-2 flex-shrink-0">
                <BsTrash 
                  className="text-lg cursor-pointer text-red-500 hover:text-red-700 transition-colors duration-200" 
                  onClick={() => handleDelete(shipment.id)}
                />
                <FiEdit 
                  className="text-lg cursor-pointer text-blue-500 hover:text-blue-700 transition-colors duration-200" 
                  onClick={() => handleEdit(shipment.id)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 flex justify-center px-4">
        <Button 
          onClick={handleAddNew}
          className="h-14 w-full max-w-sm rounded-2xl bg-primary px-4 py-2 text-base font-semibold text-white shadow-sm"
        >
          {shipments.length === 0 ? 'Tambah Alamat' : 'Tambah Alamat Baru'}
        </Button>
      </div>

      {shipmentPendingDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900">Hapus Pengiriman?</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Data alamat dan ongkir ini akan dihapus. Jika ini alamat aktif, sistem akan mengaktifkan alamat lain yang tersedia.
            </p>
            <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
              {formatShipmentAddress(shipmentPendingDelete)}
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShipmentPendingDelete(null)}
                disabled={savingIndex !== null}
                className="flex-1 rounded-2xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => void confirmDeleteShipment()}
                disabled={savingIndex !== null}
                className="flex-1 rounded-2xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingIndex !== null ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </LoginProtection>
  );
};

export default Shipment;
