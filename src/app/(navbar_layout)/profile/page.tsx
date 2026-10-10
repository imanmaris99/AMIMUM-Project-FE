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

        <div className="px-4 py-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          <section className="mb-4 rounded-3xl bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-100">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Akun customer</p>
            <h1 className="mt-1 text-lg font-bold text-[#0D0E09]">Profil Saya</h1>
            <p className="mt-1 text-xs leading-5 text-[#6B7C73]">
              Kelola identitas akun, alamat checkout, dan sesi login toko.
            </p>
          </section>

          <ProfileInfo />

          <div className="h-3" aria-hidden="true"></div>

          <ProfileSettings />
        </div>
      </div>
    </LoginProtection>
  );
};

export default ProfilePage;
