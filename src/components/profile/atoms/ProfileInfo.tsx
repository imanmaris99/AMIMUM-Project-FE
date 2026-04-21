"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import EditProfileModal, { ProfileData } from "../molecules/EditProfileModal";
import ChangePhotoModal from "../molecules/ChangePhotoModal";
import {
  getUserProfile,
  updateUserPhoto,
  updateUserProfile,
  UserProfile,
} from "@/services/api/profile";
import { SessionManager } from "@/lib/auth";

const ProfileInfo: React.FC = () => {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangePhotoModalOpen, setIsChangePhotoModalOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getUserProfile();

        if (!isMounted) {
          return;
        }

        setProfile(response.data);
        syncSessionProfile(response.data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Gagal memuat profil pengguna.";
        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEditProfileClick = () => {
    setIsEditProfileModalOpen(true);
  };

  const handleCloseEditProfileModal = () => {
    setIsEditProfileModalOpen(false);
  };

  const handleSaveProfile = async (profileData: ProfileData) => {
    if (!profile) {
      throw new Error("Data profil belum tersedia.");
    }

    const firstname = profileData.firstname.trim();
    const lastname = profileData.lastname.trim();
    const phone = profileData.phone.trim();
    const address = profileData.address.trim();
    const fullname = `${firstname} ${lastname}`.trim();

    const response = await updateUserProfile({
      fullname,
      firstname,
      lastname,
      phone,
      address,
    });

    const updatedProfile = {
      ...profile,
      firstname: response.data.firstname,
      lastname: response.data.lastname,
      phone: response.data.phone,
      address: response.data.address,
      updated_at: new Date().toISOString(),
    };

    setProfile(updatedProfile);
    syncSessionProfile(updatedProfile);

    toast.success(response.message || "Profil berhasil diperbarui.");
  };

  const handleChangePhotoClick = () => {
    setIsChangePhotoModalOpen(true);
  };

  const handleCloseChangePhotoModal = () => {
    setIsChangePhotoModalOpen(false);
  };

  const handlePhotoUpload = async (file: File) => {
    if (!profile) {
      throw new Error("Data profil belum tersedia.");
    }

    const response = await updateUserPhoto(file);

    const updatedProfile = {
      ...profile,
      photo_url: response.data.photo_url,
      updated_at: new Date().toISOString(),
    };

    setProfile(updatedProfile);
    syncSessionProfile(updatedProfile);

    toast.success(response.message || "Foto profil berhasil diperbarui.");
  };

  const syncSessionProfile = (nextProfile: UserProfile) => {
    const session = SessionManager.getSession();

    if (!session) {
      return;
    }

    SessionManager.setSession(
      {
        ...session.user,
        email: nextProfile.email,
        name:
          `${nextProfile.firstname ?? ""} ${nextProfile.lastname ?? ""}`.trim() ||
          session.user.name,
        firstname: nextProfile.firstname || session.user.firstname,
        photoUrl: nextProfile.photo_url || "",
      },
      session.token
    );

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "userProfile",
        newValue: JSON.stringify({
          email: nextProfile.email,
          firstname: nextProfile.firstname,
          photo_url: nextProfile.photo_url,
        }),
        storageArea: localStorage,
      })
    );
  };

  const displayName = useMemo(() => {
    if (!profile) {
      return "Profil pengguna";
    }

    return `${profile.firstname ?? ""} ${profile.lastname ?? ""}`.trim() || profile.email;
  }, [profile]);

  const displayAddress = profile?.address?.trim() || "Alamat belum tersedia.";
  const initialEditData = {
    firstname: profile?.firstname ?? "",
    lastname: profile?.lastname ?? "",
    phone: profile?.phone ?? "",
    address: profile?.address ?? "",
  };

  return (
    <div className="bg-white">
      {/* Profile Photo Section */}
      <div className="flex flex-col items-center py-8 px-4">
        {/* Profile Avatar */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-[#E6F2F0] rounded-full flex items-center justify-center">
            {profile?.photo_url ? (
              <Image
                src={profile.photo_url}
                alt={displayName}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <Image
                src="/profile-circle.svg"
                alt="Profile"
                width={80}
                height={80}
                className="text-[#292D32]"
              />
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-[#242424]">
            {isLoading ? "Memuat profil..." : displayName}
          </h2>
          
          <div className="space-y-1">
            {isLoading ? (
              <p className="text-xs text-[#A2A2A2]">Mengambil data profil dari server...</p>
            ) : errorMessage ? (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-center">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-[#313131]">
                  {profile?.role ? `Role: ${profile.role}` : "Role belum tersedia"}
                </p>
                <p className="text-xs text-[#A2A2A2]">
                  {displayAddress}
                </p>
                <p className="text-xs text-[#A2A2A2]">
                  {profile?.email ?? "-"}
                </p>
                <p className="text-xs text-[#A2A2A2]">
                  {profile?.phone ?? "Nomor telepon belum tersedia."}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6">
          <button 
            onClick={handleEditProfileClick}
            disabled={isLoading || Boolean(errorMessage)}
            className="bg-[#007A4F] text-[#E6F2F0] px-4 py-2 rounded-2xl text-sm font-medium border border-[#A2A2A2] flex items-center gap-2 hover:bg-[#005A3C] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
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
            disabled={isLoading || Boolean(errorMessage)}
            className="bg-[#E6F2F0] text-[#0D0E09] px-4 py-2 rounded-2xl text-sm font-medium border border-[#A2A2A2] flex items-center gap-2 hover:bg-[#D4E8E0] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
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
        initialData={initialEditData}
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
