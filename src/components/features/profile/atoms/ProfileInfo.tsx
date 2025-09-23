"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import EditProfileModal from "../molecules/EditProfileModal";
import ChangePhotoModal from "../molecules/ChangePhotoModal";

const ProfileInfo: React.FC = () => {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangePhotoModalOpen, setIsChangePhotoModalOpen] = useState(false);

  const handleEditProfileClick = () => {
    setIsEditProfileModalOpen(true);
  };

  const handleCloseEditProfileModal = () => {
    setIsEditProfileModalOpen(false);
  };

  const handleSaveProfile = (profileData: { firstname: string; lastname: string; phone: string; address: string }) => {
    // Handle save profile data
    
    // Show success message
    toast.success("Profile berhasil diperbarui!");
  };

  const handleChangePhotoClick = () => {
    setIsChangePhotoModalOpen(true);
  };

  const handleCloseChangePhotoModal = () => {
    setIsChangePhotoModalOpen(false);
  };

  const handlePhotoUpload = (file: File) => {
    // Handle photo upload
    
    // Show success message
    toast.success("Foto berhasil diunggah!");
  };

  return (
    <div className="bg-white">
      {/* Profile Photo Section */}
      <div className="flex flex-col items-center py-8 px-4">
        {/* Profile Avatar */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-[#E6F2F0] rounded-full flex items-center justify-center">
            <Image
              src="/profile-circle.svg"
              alt="Profile"
              width={80}
              height={80}
              className="text-[#292D32]"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-[#242424]">
            Faisal Jaya
          </h2>
          
          <div className="space-y-1">
            <p className="text-sm text-[#313131]">
              Jl. Sunan Kalijaga
            </p>
            <p className="text-xs text-[#A2A2A2]">
              Kpg. Nelayan No. 220, Pati, Jawa Tengah.
            </p>
            <p className="text-xs text-[#A2A2A2]">
              raziul.cse@gmail.com
            </p>
            <p className="text-xs text-[#A2A2A2]">
              +62 877 877 3455
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6">
          <button 
            onClick={handleEditProfileClick}
            className="bg-[#007A4F] text-[#E6F2F0] px-4 py-2 rounded-2xl text-sm font-medium border border-[#A2A2A2] flex items-center gap-2 hover:bg-[#005A3C] transition-colors"
          >
            <Image
              src="/edit.svg"
              alt="Edit"
              width={14}
              height={14}
              className="text-[#E6F2F0]"
            />
            Edit Akunku
          </button>
          
          <button 
            onClick={handleChangePhotoClick}
            className="bg-[#E6F2F0] text-[#0D0E09] px-4 py-2 rounded-2xl text-sm font-medium border border-[#A2A2A2] flex items-center gap-2 hover:bg-[#D4E8E0] transition-colors"
          >
            <Image
              src="/gallery-export.svg"
              alt="Gallery"
              width={14}
              height={14}
              className="text-[#0D0E09]"
            />
            Ganti Foto
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={handleCloseEditProfileModal}
        onSave={handleSaveProfile}
        initialData={{
          firstname: "Faisal",
          lastname: "Jaya",
          phone: "+62 877 877 3455",
          address: "Jl. Sunan Kalijaga, Kpg. Nelayan No. 220, Pati, Jawa Tengah."
        }}
      />

      {/* Change Photo Modal */}
      <ChangePhotoModal
        isOpen={isChangePhotoModalOpen}
        onClose={handleCloseChangePhotoModal}
        onUpload={handlePhotoUpload}
      />
    </div>
  );
};

export default ProfileInfo;
