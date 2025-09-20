"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";
import { toast } from "react-hot-toast";
import EditAddressModal from "../../../components/profile/molecules/EditAddressModal";
import AddAddressModal from "../../../components/profile/molecules/AddAddressModal";

const SavedAddressesPage: React.FC = () => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string>("1"); // Default select first address
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddress(addressId);
  };

  const handleEditAddress = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveAddress = (addressData: {
    name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  }) => {
    // Handle save address data
    console.log("Address data saved:", addressData);
    
    // Show success message
    toast.success("Alamat berhasil diperbarui!");
  };

  const handleAddAddress = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSaveNewAddress = (addressData: {
    name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  }) => {
    // Handle save new address data
    console.log("New address data saved:", addressData);
    
    // Show success message
    toast.success("Alamat baru berhasil ditambahkan!");
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gray-100">
      {/* Header - Same style as track order with white background */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex justify-center items-center relative mt-16 py-4">
          <div className="absolute left-10">
            <GoChevronLeft className="text-3xl cursor-pointer" onClick={handleBack} />
          </div>
          <div className="text-center">
            <h1 className="text-[16px] font-semibold">Alamat Tersimpan</h1>
            <p className="text-xs text-gray-500 mt-1">Kelola alamat pengiriman Anda</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center items-center gap-4 mt-20 mb-8 px-4">
        {/* Address Cards */}
        <div className="w-full max-w-sm space-y-4">
          {/* Address Card 1 */}
          <div 
            className={`bg-white rounded-lg p-4 relative cursor-pointer transition-colors ${
              selectedAddress === "1" ? "ring-2 ring-[#006A47]" : ""
            }`}
            onClick={() => handleSelectAddress("1")}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <div className="w-6 h-6 flex items-center justify-center mt-2">
                <div 
                  className={`w-5 h-5 border-2 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                    selectedAddress === "1" 
                      ? "bg-[#006A47] border-[#006A47]" 
                      : "border-gray-300 hover:border-[#006A47]"
                  }`}
                  onClick={() => handleSelectAddress("1")}
                >
                  {selectedAddress === "1" && (
                    <svg 
                      className="w-3 h-3 text-white" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Address Info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#313131] mb-1">
                  Jl. Sunan Kalijaga
                </h3>
                <p className="text-sm text-[#A2A2A2] leading-relaxed">
                  Kpg. Nelayan No. 220, Pati, Jawa Tengah.
                </p>
              </div>

              {/* Edit Button */}
              <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAddress();
                        }}
                className="bg-[#006A47] text-white px-3 py-1.5 rounded-2xl text-sm font-medium hover:bg-[#005A3C] transition-colors"
              >
                Edit
              </button>
            </div>

            {/* Divider Line */}
            <div className="w-full h-[1.5px] bg-[#C4C4C4] mt-4"></div>
          </div>

          {/* Address Card 2 */}
          <div 
            className={`bg-white rounded-lg p-4 relative cursor-pointer transition-colors ${
              selectedAddress === "2" ? "ring-2 ring-[#006A47]" : ""
            }`}
            onClick={() => handleSelectAddress("2")}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <div className="w-6 h-6 flex items-center justify-center mt-2">
                <div 
                  className={`w-5 h-5 border-2 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                    selectedAddress === "2" 
                      ? "bg-[#006A47] border-[#006A47]" 
                      : "border-gray-300 hover:border-[#006A47]"
                  }`}
                  onClick={() => handleSelectAddress("2")}
                >
                  {selectedAddress === "2" && (
                    <svg 
                      className="w-3 h-3 text-white" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Address Info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#313131] mb-1">
                  Jl. Sunan Kalijaga
                </h3>
                <p className="text-sm text-[#A2A2A2] leading-relaxed">
                  Kpg. Nelayan No. 220, Pati, Jawa Tengah.
                </p>
              </div>

              {/* Edit Button */}
              <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAddress();
                        }}
                className="bg-[#006A47] text-white px-3 py-1.5 rounded-2xl text-sm font-medium hover:bg-[#005A3C] transition-colors"
              >
                Edit
              </button>
            </div>

            {/* Divider Line */}
            <div className="w-full h-[1.5px] bg-[#C4C4C4] mt-4"></div>
          </div>
        </div>

        {/* Add Address Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleAddAddress}
            className="w-8 h-8 bg-[#E6F2F0] rounded-2xl flex items-center justify-center"
          >
            <span className="text-[#0D0E09] text-lg font-medium">+</span>
          </button>
        </div>
      </div>

              {/* Footer */}
              <div className="flex justify-center items-center mt-auto mb-10">
                <div className="flex justify-center items-center gap-1">
                  <span className="text-xs font-bold text-black">©2025</span>
                  <span className="text-xs text-gray-500">by</span>
                  <span className="text-xs font-bold text-primary">Amimum Team.</span>
                </div>
              </div>

              {/* Edit Address Modal */}
              <EditAddressModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleSaveAddress}
                initialData={{
                  name: "Faisal Jaya",
                  phone: "+62 877 877 3455",
                  address: "Jl. Sunan Kalijaga",
                  city: "Pati",
                  province: "Jawa Tengah",
                  country: "Indonesia",
                  postalCode: "59114"
                }}
              />

              {/* Add Address Modal */}
              <AddAddressModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onSave={handleSaveNewAddress}
              />
            </div>
          );
        };

        export default SavedAddressesPage;
