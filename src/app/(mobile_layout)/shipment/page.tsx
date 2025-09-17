"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStates, setActiveStates] = useState<boolean[]>([]);

  // Simulasi loading data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulasi delay API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShipments(dummyShipments);
      setActiveStates(dummyShipments.map(shipment => shipment.isActive));
      setLoading(false);
    };
    
    loadData();
  }, []);

  const handleIconClick = (index: number) => {
    setActiveStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const handleEdit = (shipmentId: string) => {
    router.push(`/shipment/edit?shipmentId=${shipmentId}`);
  };

  const handleDelete = (shipmentId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus alamat pengiriman ini?")) {
      setShipments(prev => prev.filter(shipment => shipment.id !== shipmentId));
      setActiveStates(prev => prev.filter((_, index) => 
        shipments.findIndex(s => s.id === shipmentId) !== index
      ));
    }
  };

  const handleAddNew = () => {
    router.push("/shipment/edit");
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return <ShipmentSkeleton />;
  }

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div className="flex justify-center items-center relative mt-16">
        <div className="absolute left-10">
          <GoChevronLeft className="text-3xl cursor-pointer" onClick={handleBack} />
        </div>
        <div>
          <h1 className="text-[16px] font-semibold">Alamat Pengirimanku</h1>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-4 mt-20 mb-8">
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
            <div key={shipment.id} className="flex justify-center items-center gap-4 w-80 border-b border-gray-300 pb-4">
              <div onClick={() => handleIconClick(index)}>
                {activeStates[index] ? (
                  <RiCheckboxCircleLine className="text-2xl cursor-pointer text-primary" />
                ) : (
                  <RiCheckboxBlankCircleLine className="text-2xl cursor-pointer" />
                )}
              </div>

              <div className="flex flex-col justify-center gap-1 flex-1">
                <p className="text-xs font-semibold">{shipment.address.city}, {shipment.address.state}</p>
                <p className="text-xs text-gray-500">
                  {shipment.address.address}, {shipment.address.city}, Kode Pos {shipment.address.zipCode}, {shipment.address.state}, {shipment.address.country}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {shipment.courier.courierName} - {shipment.courier.serviceType} | Rp {shipment.courier.cost.toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col justify-center items-center gap-2">
                <BsTrash 
                  className="text-lg cursor-pointer text-red-500 hover:text-red-700" 
                  onClick={() => handleDelete(shipment.id)}
                />
                <FiEdit 
                  className="text-lg cursor-pointer text-blue-500 hover:text-blue-700" 
                  onClick={() => handleEdit(shipment.id)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center items-center mt-auto mb-10">
        <Button 
          onClick={handleAddNew}
          className="bg-primary text-white px-4 py-2 rounded-lg w-80 h-14 text-lg"
        >
          {shipments.length === 0 ? 'Tambah Alamat' : 'Tambah Alamat Baru'}
        </Button>
      </div>
    </div>
  );
};

export default Shipment;
