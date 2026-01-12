"use client";

import React from "react";
import { ProfileInfo } from "@/components/profile";
import { ProfileSettings } from "@/components/profile";
import LoginProtection from "@/components/common/LoginProtection";
import UnifiedHeader from "@/components/common/UnifiedHeader";

const ProfilePage: React.FC = () => {



  return (
    <LoginProtection useModal={true} feature="profile">
      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Unified Header */}
        <UnifiedHeader 
          type="main"
          showSearch={false}
          showCart={true}
          showNotifications={true}
        />

        {/* Content */}
        <div className="py-4">
          {/* Profile Info Section */}
          <ProfileInfo />

          {/* Divider Line */}
          <div className="w-full h-1 bg-[#E6F2F0]"></div>

          {/* Settings Section */}
          <ProfileSettings />
        </div>
      </div>
    </LoginProtection>
  );
};

export default ProfilePage;
