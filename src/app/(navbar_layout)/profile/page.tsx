"use client";

import React from "react";
import { ProfileInfo } from "@/components/profile";
import { ProfileSettings } from "@/components/profile";
import LoginProtection from "@/components/common/LoginProtection";
import UnifiedHeader from "@/components/common/UnifiedHeader";

const ProfilePage: React.FC = () => {



  return (
    <LoginProtection useModal={true} feature="profile">
      <div className="min-h-screen bg-transparent">
        {/* Unified Header */}
        <UnifiedHeader 
          type="main"
          showSearch={false}
          showCart={true}
          showNotifications={true}
        />

        {/* Content */}
        <div className="px-4 py-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          {/* Profile Info Section */}
          <ProfileInfo />

          {/* Divider Line */}
          <div className="h-3" aria-hidden="true"></div>

          {/* Settings Section */}
          <ProfileSettings />
        </div>
      </div>
    </LoginProtection>
  );
};

export default ProfilePage;
