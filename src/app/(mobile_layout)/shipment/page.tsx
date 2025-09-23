"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";
import { BsTrash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { dummyShipments } from "@/data/shipmentDummyData";
import { ShipmentData } from "@/types/shipment";

const ShipmentSkeleton = () => (
  <div className="flex flex-col justify-between min-h-screen animate-pulse">
    <div className="flex justify-center items-center relative mt-16">
      <div className="absolute left-10">
        <div className="h-8 w-8 bg-gray-300 rounded-full" />
      </div>
      <div>
        <div className="h-6 w-40 bg-gray-300 rounded" />
      </div>
    </div>
    <div className="flex flex-col justify-center items-center gap-4 mt-20 mb-8 w-full">
      {[...Array(2)].map((_, index) => (
        <div key={index} className="flex justify-center items-center gap-4 w-80 border-b border-gray-300 pb-4">
          <div className="h-6 w-6 bg-gray-300 rounded-full" />
          <div className="flex flex-col justify-center gap-1 flex-1">
            <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
            <div className="h-4 w-64 bg-gray-300 rounded" />
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="h-5 w-5 bg-gray-300 rounded-full" />
            <div className="h-5 w-5 bg-gray-300 rounded-full" />
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-center items-center mt-auto mb-10">
      <div className="h-14 w-80 bg-gray-300 rounded-lg" />
    </div>
  </div>
);

const Shipment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStates, setActiveStates] = useState<boolean[]>([]);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Simulasi loading data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulasi delay API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShipments(dummyShipments);
      
      // Memastikan hanya 1 alamat yang aktif
      const activeStates = dummyShipments.map(shipment => shipment.is_active);
      const activeCount = activeStates.filter(state => state).length;
      
      // Jika lebih dari 1 yang aktif, reset ke hanya yang pertama
      if (activeCount > 1) {
        const resetStates = new Array(activeStates.length).fill(false);
        resetStates[0] = true; // Set hanya yang pertama sebagai aktif
        setActiveStates(resetStates);
      } else {
        setActiveStates(activeStates);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, []);

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

  const handleIconClick = async (index: number) => {
    // Jika sudah aktif, tidak perlu melakukan apa-apa
    if (activeStates[index]) return;
    
    setActiveStates((prevStates) => {
      // Reset semua ke false, lalu set yang dipilih ke true
      const newStates = new Array(prevStates.length).fill(false);
      newStates[index] = true;
      return newStates;
    });
    
    // Set loading state untuk alamat yang sedang disimpan
    setSavingIndex(index);
    
    // Simulasi save preferensi alamat otomatis
    const selectedShipment = shipments[index];
    if (selectedShipment) {
      
      // Simulasi API call untuk menyimpan preferensi
      try {
        // Simulasi delay API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update data shipment untuk mencerminkan perubahan
        setShipments(prev => prev.map((shipment, idx) => ({
          ...shipment,
          isActive: idx === index
        })));
        
      } catch {
      } finally {
        setSavingIndex(null);
      }
    }
  };

  const handleEdit = (shipmentId: string) => {
    router.push(`/shipment/edit?shipmentId=${shipmentId}`);
  };

  const handleDelete = (shipmentId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus alamat pengiriman ini?")) {
      const deletedIndex = shipments.findIndex(s => s.id === shipmentId);
      const wasActive = activeStates[deletedIndex];
      
      setShipments(prev => prev.filter(shipment => shipment.id !== shipmentId));
      setActiveStates(prev => {
        const newStates = prev.filter((_, index) => index !== deletedIndex);
        
        // Jika yang dihapus adalah alamat aktif, set alamat pertama sebagai aktif
        if (wasActive && newStates.length > 0) {
          const hasActive = newStates.some(state => state);
          if (!hasActive) {
            newStates[0] = true;
          }
        }
        
        return newStates;
      });
    }
  };

  const handleAddNew = () => {
    router.push("/shipment/create");
  };

  const handleBack = () => {
    router.back();
  };


  if (loading) {
    return <ShipmentSkeleton />;
  }

  return (
    <div className="flex flex-col justify-between min-h-screen">
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
      <div className="flex justify-center items-center relative mt-16">
        <div className="absolute left-10">
          <GoChevronLeft className="text-3xl cursor-pointer" onClick={handleBack} />
        </div>
        <div className="text-center">
          <h1 className="text-[16px] font-semibold">Alamat Pengirimanku</h1>
          <p className="text-xs text-gray-500 mt-1">Pilih 1 alamat sebagai alamat utama</p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-4 mt-20 mb-8 px-4">
        {shipments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-gray-500 text-sm mb-4">Belum ada alamat pengiriman</p>
            <Button 
              onClick={handleAddNew}
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              Tambah Alamat
            </Button>
          </div>
        ) : (
          shipments.map((shipment, index) => (
            <div 
              key={shipment.id} 
              className={`flex items-start gap-3 w-full max-w-sm border-b border-gray-300 pb-4 transition-all duration-300 ease-in-out transform ${
                activeStates[index] ? 'bg-blue-50 rounded-lg p-3 scale-[1.02]' : 'p-1 scale-100'
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
                    {shipment.address.city}, {shipment.address.state}
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
                  {shipment.address.address}, {shipment.address.city}, Kode Pos {shipment.address.zip_code}, {shipment.address.state}, {shipment.address.country}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {shipment.courier.courier_name} - {shipment.courier.service_type} | Rp {shipment.courier.cost?.toLocaleString() || '0'}
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

      <div className="flex justify-center items-center mt-auto mb-10 px-4">
        <Button 
          onClick={handleAddNew}
          className="bg-primary text-white px-4 py-2 rounded-lg w-full max-w-sm h-14 text-lg"
        >
          {shipments.length === 0 ? 'Tambah Alamat' : 'Tambah Alamat Baru'}
        </Button>
      </div>
    </div>
  );
};

export default Shipment;
