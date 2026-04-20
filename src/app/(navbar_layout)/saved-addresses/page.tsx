"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";
import { toast } from "react-hot-toast";
import EditAddressModal from "../../../components/profile/molecules/EditAddressModal";
import DeleteAddressModal from "../../../components/profile/molecules/DeleteAddressModal";
import AddAddressModal, {
  AddressFormData,
} from "../../../components/profile/molecules/AddAddressModal";
import {
  createShipmentAddress,
  deleteShipmentAddress,
  getMyShipmentAddresses,
  ShipmentAddress,
  updateShipmentAddress,
} from "@/services/api/shipment-address";

const SavedAddressesPage: React.FC = () => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<ShipmentAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);
  const [addressPendingDelete, setAddressPendingDelete] = useState<ShipmentAddress | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAddresses = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMyShipmentAddresses();

        if (!isMounted) {
          return;
        }

        setAddresses(response.data);
        setSelectedAddress((prev) =>
          prev || response.data[0]?.id?.toString() || ""
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Gagal memuat alamat pengiriman."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAddresses();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleSaveAddress = async (addressData: AddressFormData) => {
    if (!selectedAddressData) {
      throw new Error("Alamat yang akan diperbarui tidak ditemukan.");
    }

    const normalizedPhone = addressData.phone.trim();
    const normalizedPostalCode = addressData.postalCode.trim();

    if (!/^\+62\d{10,11}$/.test(normalizedPhone)) {
      throw new Error(
        "Nomor telepon harus diawali +62 dan berisi 10-11 digit setelahnya."
      );
    }

    if (normalizedPostalCode && !/^\d+$/.test(normalizedPostalCode)) {
      throw new Error("Kode pos harus berupa angka.");
    }

    if (!addressData.cityId.trim()) {
      throw new Error("Kota/Kabupaten harus dipilih dari data RajaOngkir.");
    }

    const response = await updateShipmentAddress({
      address_id: selectedAddressData.id,
      name: addressData.name.trim(),
      phone: normalizedPhone,
      address: addressData.address.trim(),
      city: addressData.city.trim(),
      state: addressData.province.trim(),
      country: addressData.country.trim(),
      city_id: Number(addressData.cityId),
      zip_code: normalizedPostalCode
        ? Number(normalizedPostalCode)
        : undefined,
    });

    setAddresses((prev) =>
      prev.map((item) =>
        item.id === selectedAddressData.id
          ? {
              ...item,
              ...response.data,
            }
          : item
      )
    );

    toast.success("Alamat pengiriman berhasil diperbarui.");
  };

  const handleAddAddress = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenDeleteModal = (address: ShipmentAddress) => {
    setAddressPendingDelete(address);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (deletingAddressId) {
      return;
    }

    setIsDeleteModalOpen(false);
    setAddressPendingDelete(null);
  };

  const handleDeleteAddress = async () => {
    if (!addressPendingDelete) {
      return;
    }

    setDeletingAddressId(addressPendingDelete.id);

    try {
      await deleteShipmentAddress(addressPendingDelete.id);

      setAddresses((prev) => {
        const remainingAddresses = prev.filter(
          (item) => item.id !== addressPendingDelete.id
        );

        setSelectedAddress((currentSelected) => {
          if (currentSelected !== addressPendingDelete.id.toString()) {
            return currentSelected;
          }

          return remainingAddresses[0]?.id?.toString() || "";
        });

        return remainingAddresses;
      });

      toast.success("Alamat pengiriman berhasil dihapus.");
      setIsDeleteModalOpen(false);
      setAddressPendingDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menghapus alamat pengiriman."
      );
    } finally {
      setDeletingAddressId(null);
    }
  };

  const handleSaveNewAddress = async (addressData: AddressFormData) => {
    const normalizedPhone = addressData.phone.trim();
    const normalizedPostalCode = addressData.postalCode.trim();

    if (!/^\+62\d{10,11}$/.test(normalizedPhone)) {
      throw new Error(
        "Nomor telepon harus diawali +62 dan berisi 10-11 digit setelahnya."
      );
    }

    if (normalizedPostalCode && !/^\d+$/.test(normalizedPostalCode)) {
      throw new Error("Kode pos harus berupa angka.");
    }

    if (!addressData.cityId.trim()) {
      throw new Error("Kota/Kabupaten harus dipilih dari data RajaOngkir.");
    }

    const response = await createShipmentAddress({
      name: addressData.name.trim(),
      phone: normalizedPhone,
      address: addressData.address.trim(),
      city: addressData.city.trim(),
      state: addressData.province.trim(),
      country: addressData.country.trim(),
      city_id: Number(addressData.cityId),
      zip_code: normalizedPostalCode
        ? Number(normalizedPostalCode)
        : undefined,
    });

    setAddresses((prev) => [response.data, ...prev]);
    setSelectedAddress(response.data.id.toString());
    toast.success("Alamat baru berhasil ditambahkan.");
  };

  const selectedAddressData = useMemo(() => {
    return (
      addresses.find((item) => item.id.toString() === selectedAddress) ?? null
    );
  }, [addresses, selectedAddress]);

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
        <div className="w-full max-w-sm space-y-4">
          {isLoading ? (
            <div className="rounded-lg bg-white p-6 text-center">
              <p className="text-sm text-[#A2A2A2]">
                Mengambil alamat pengiriman dari server...
              </p>
            </div>
          ) : errorMessage ? (
            <div className="rounded-lg bg-red-50 p-6 text-center">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="rounded-lg bg-white p-6 text-center">
              <p className="text-sm text-[#A2A2A2]">
                Belum ada alamat pengiriman tersimpan.
              </p>
            </div>
          ) : (
            addresses.map((item) => {
              const addressId = item.id.toString();
              const isSelected = selectedAddress === addressId;
              const addressSummary = [
                item.address,
                item.city,
                item.state,
                item.country,
                item.zip_code ? String(item.zip_code) : "",
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg p-4 relative cursor-pointer transition-colors ${
                    isSelected ? "ring-2 ring-[#006A47]" : ""
                  }`}
                  onClick={() => handleSelectAddress(addressId)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 flex items-center justify-center mt-2">
                      <div
                        className={`w-5 h-5 border-2 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#006A47] border-[#006A47]"
                            : "border-gray-300 hover:border-[#006A47]"
                        }`}
                        onClick={() => handleSelectAddress(addressId)}
                      >
                        {isSelected && (
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

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#313131] mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-[#313131] mb-1">{item.phone}</p>
                      <p className="text-sm text-[#A2A2A2] leading-relaxed">
                        {addressSummary}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAddress(addressId);
                        handleEditAddress();
                      }}
                      className="bg-[#006A47] text-white px-3 py-1.5 rounded-2xl text-sm font-medium hover:bg-[#005A3C] transition-colors"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDeleteModal(item);
                      }}
                      disabled={deletingAddressId === item.id}
                      className="text-sm font-medium text-red-600 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingAddressId === item.id ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>

                  <div className="w-full h-[1.5px] bg-[#C4C4C4] mt-4"></div>
                </div>
              );
            })
          )}
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
                  name: selectedAddressData?.name ?? "",
                  phone: selectedAddressData?.phone ?? "",
                  address: selectedAddressData?.address ?? "",
                  city: selectedAddressData?.city ?? "",
                  cityId: selectedAddressData?.city_id?.toString() ?? "",
                  province: selectedAddressData?.state ?? "",
                  country: selectedAddressData?.country ?? "",
                  postalCode: selectedAddressData?.zip_code?.toString() ?? ""
                }}
              />

              {/* Add Address Modal */}
              <AddAddressModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onSave={handleSaveNewAddress}
              />

              <DeleteAddressModal
                isOpen={isDeleteModalOpen}
                addressName={addressPendingDelete?.name ?? ""}
                isDeleting={Boolean(deletingAddressId)}
                onClose={handleCloseDeleteModal}
                onConfirm={() => {
                  void handleDeleteAddress();
                }}
              />
            </div>
          );
        };

        export default SavedAddressesPage;
