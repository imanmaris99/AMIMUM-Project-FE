"use client";

import React from "react";
import Image from "next/image";

const ProfileInfo: React.FC = () => {
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
          <button className="bg-[#007A4F] text-[#E6F2F0] px-4 py-2 rounded-2xl text-sm font-medium border border-[#A2A2A2] flex items-center gap-2">
            <Image
              src="/edit.svg"
              alt="Edit"
              width={14}
              height={14}
              className="text-[#E6F2F0]"
            />
            Edit Akunku
          </button>
          
          <button className="bg-[#E6F2F0] text-[#0D0E09] px-4 py-2 rounded-2xl text-sm font-medium border border-[#A2A2A2] flex items-center gap-2">
            <Image
              src="/note.svg"
              alt="Note"
              width={14}
              height={14}
              className="text-[#0D0E09]"
            />
            Ganti Foto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
