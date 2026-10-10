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

  const displayAddress = profile?.address?.trim() || "Alamat profil belum tersedia.";
  const displayPhone = profile?.phone?.trim() || "Nomor telepon belum tersedia.";
  const initialEditData = {
    firstname: profile?.firstname ?? "",
    lastname: profile?.lastname ?? "",
    phone: profile?.phone ?? "",
    address: profile?.address ?? "",
  };

  return (
    <div className="rounded-3xl bg-white/95 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-emerald-50 backdrop-blur">
      {/* Profile Photo Section */}
      <div className="flex flex-col items-center px-4 pb-6 pt-5 sm:py-8">
        {/* Profile Avatar */}
        <div className="relative mb-4 sm:mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E6F2F0] shadow-inner ring-4 ring-emerald-50 sm:h-24 sm:w-24">
            {profile?.photo_url ? (
              // Use native img to avoid remote image configuration issues.
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.photo_url}
                alt={displayName}
                className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24"
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
        <div className="max-w-[360px] space-y-1.5 text-center">
          <h2 className="text-lg font-semibold text-[#242424] sm:text-xl">
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
                <div className="mx-auto w-full max-w-xs rounded-3xl bg-emerald-50/70 p-3 text-left">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Data Akun Customer
                  </p>
                  <div className="space-y-2 text-xs leading-relaxed text-[#4B5C54]">
                    <p className="break-words"><span className="font-semibold text-[#0D0E09]">Email:</span> {profile?.email ?? "Belum tersedia"}</p>
                    <p><span className="font-semibold text-[#0D0E09]">Telepon:</span> {displayPhone}</p>
                    <p className="break-words"><span className="font-semibold text-[#0D0E09]">Alamat profil:</span> {displayAddress}</p>
                  </div>
                </div>
                <p className="mx-auto max-w-xs rounded-2xl bg-white px-3 py-2 text-xs font-medium leading-relaxed text-primary ring-1 ring-emerald-100">
                  Alamat checkout tetap dikelola dari menu Alamat Pengiriman Tersimpan agar ongkir akurat.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex w-full max-w-[360px] gap-2 sm:mt-6">
          <button 
            onClick={handleEditProfileClick}
            disabled={isLoading || Boolean(errorMessage)}
            className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl border border-[#006A47] bg-[#006A47] px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#005A3C] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Image
              src="/edit.svg"
              alt="Edit"
              width={14}
              height={14}
              className="text-[#E6F2F0]"
            />
            Edit Profil
          </button>
          
          <button 
            onClick={handleChangePhotoClick}
            disabled={isLoading || Boolean(errorMessage)}
            className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-[#006A47] transition-colors hover:bg-[#D4E8E0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Image
              src="/gallery-export.svg"
              alt="Gallery"
              width={14}
              height={14}
              className="text-[#0D0E09]"
            />
            Foto Profil
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
