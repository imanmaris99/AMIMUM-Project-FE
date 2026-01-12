"use client";

import React from "react";

interface ProfileHeaderProps {
  isLoggedIn: boolean;
  userEmail: string;
  onLogout: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  // isLoggedIn, // Removed unused parameter
  // userEmail, // Removed unused parameter
  // onLogout // Removed unused parameter
}) => {
  return (
    <div className="bg-white px-4 py-4">
      <div className="flex items-center justify-center">
        <h1 className="text-lg font-semibold text-[#0D0E09]">
          Profilku
        </h1>
      </div>
    </div>
  );
};

export default ProfileHeader;
