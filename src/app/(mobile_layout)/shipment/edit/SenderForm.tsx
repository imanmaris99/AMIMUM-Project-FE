import React, { useState, useEffect } from "react";
import { LuContact, LuPhone, LuMapPin } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { SenderFormData } from "@/types/shipment";
import { dummyStoreAddress } from "@/data/shipmentDummyData";

interface SenderFormProps {
  onSubmit: (data: SenderFormData) => void;
  initialData?: SenderFormData;
}

const SenderForm: React.FC<SenderFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<SenderFormData>({
    senderName: "",
    phoneNumber: "",
    country: "",
    province: "",
    city: "",
    cityId: "",
    postalCode: "",
    fullAddress: ""
  });
  const [errors, setErrors] = useState<Partial<SenderFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load data dummy atau initial data
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Load data dummy toko
      setFormData({
        senderName: dummyStoreAddress.name,
        phoneNumber: dummyStoreAddress.phone,
        country: dummyStoreAddress.country,
        province: dummyStoreAddress.state,
        city: dummyStoreAddress.city,
        cityId: dummyStoreAddress.cityId.toString(),
        postalCode: dummyStoreAddress.zipCode,
        fullAddress: dummyStoreAddress.address
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<SenderFormData> = {};

    if (!formData.senderName.trim()) {
      newErrors.senderName = "Nama pengirim harus diisi";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Nomor handphone harus diisi";
    } else if (!/^\+62\d{10,11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Format nomor handphone tidak valid (contoh: +6281234567890)";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Negara harus diisi";
    }

    if (!formData.province.trim()) {
      newErrors.province = "Provinsi harus diisi";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Kota/Kabupaten harus diisi";
    }

    if (!formData.cityId.trim()) {
      newErrors.cityId = "ID Kota/Kabupaten harus diisi";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Kode pos harus diisi";
    }

    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress = "Alamat lengkap harus diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof SenderFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulasi delay API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit(formData);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 px-10 py-4 w-full flex flex-col gap-4">
      <div className="flex flex-col gap-2 relative">
        <label htmlFor="senderName" className="text-[14px] font-semibold">Nama Pengirim</label>
        <LuContact className="text-xl absolute left-2 top-9 stroke-1" />
        <input 
          type="text" 
          id="senderName" 
          name="senderName" 
          value={formData.senderName}
          onChange={handleInputChange}
          className={`border rounded-md outline-none px-2 py-1 bg-gray-200 pl-10 ${
            errors.senderName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Masukkan nama pengirim"
        />
        {errors.senderName && (
          <p className="text-red-500 text-xs mt-1">{errors.senderName}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 relative">
        <label htmlFor="phoneNumber" className="text-[14px] font-semibold">Nomor Handphone</label>
        <LuPhone className="text-xl absolute left-2 top-9 stroke-1" />
        <input 
          type="text" 
          id="phoneNumber" 
          name="phoneNumber" 
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className={`border rounded-md outline-none px-2 py-1 bg-gray-200 pl-10 ${
            errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="+6281234567890"
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 relative">
        <label htmlFor="country" className="text-[14px] font-semibold">Negara</label>
        <LuMapPin className="text-xl absolute left-2 top-9 stroke-1" />
        <input 
          type="text" 
          id="country" 
          name="country" 
          value={formData.country}
          onChange={handleInputChange}
          className={`border rounded-md outline-none px-2 py-1 bg-gray-200 pl-10 ${
            errors.country ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Indonesia"
        />
        {errors.country && (
          <p className="text-red-500 text-xs mt-1">{errors.country}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 relative">
        <label htmlFor="province" className="text-[14px] font-semibold">Provinsi</label>
        <LuMapPin className="text-xl absolute left-2 top-9 stroke-1" />
        <input 
          type="text" 
          id="province" 
          name="province" 
          value={formData.province}
          onChange={handleInputChange}
          className={`border rounded-md outline-none px-2 py-1 bg-gray-200 pl-10 ${
            errors.province ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="DKI Jakarta"
        />
        {errors.province && (
          <p className="text-red-500 text-xs mt-1">{errors.province}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 relative">
        <label htmlFor="city" className="text-[14px] font-semibold">Kota/Kabupaten</label>
        <LuMapPin className="text-xl absolute left-2 top-9 stroke-1" />
        <input 
          type="text" 
          id="city" 
          name="city" 
          value={formData.city}
          onChange={handleInputChange}
          className={`border rounded-md outline-none px-2 py-1 bg-gray-200 pl-10 ${
            errors.city ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Jakarta Selatan"
        />
        {errors.city && (
          <p className="text-red-500 text-xs mt-1">{errors.city}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 relative">
        <label htmlFor="cityId" className="text-[14px] font-semibold">ID.Kota/Kabupaten</label>
        <LuMapPin className="text-xl absolute left-2 top-9 stroke-1" />
        <input 
          type="text" 
          id="cityId" 
          name="cityId" 
          value={formData.cityId}
          onChange={handleInputChange}
          className={`border rounded-md outline-none px-2 py-1 bg-gray-200 pl-10 ${
            errors.cityId ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="126"
        />
        {errors.cityId && (
          <p className="text-red-500 text-xs mt-1">{errors.cityId}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 relative">
        <label htmlFor="postalCode" className="text-[14px] font-semibold">Kode Pos</label>
        <LuMapPin className="text-xl absolute left-2 top-9 stroke-1" />
        <input 
          type="text" 
          id="postalCode" 
          name="postalCode" 
          value={formData.postalCode}
          onChange={handleInputChange}
          className={`border rounded-md outline-none px-2 py-1 bg-gray-200 pl-10 ${
            errors.postalCode ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="12530"
        />
        {errors.postalCode && (
          <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 relative">
        <label htmlFor="fullAddress" className="text-[14px] font-semibold">Alamat Lengkap</label>
        <LuMapPin className="text-xl absolute left-2 top-9 stroke-1" />
        <textarea 
          id="fullAddress" 
          name="fullAddress" 
          value={formData.fullAddress}
          onChange={handleInputChange}
          className={`border rounded-md outline-none px-2 py-1 bg-gray-200 pl-10 min-h-[100px] resize-none ${
            errors.fullAddress ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Jl. Raya Industri No. 88, Kawasan Industri"
        />
        {errors.fullAddress && (
          <p className="text-red-500 text-xs mt-1">{errors.fullAddress}</p>
        )}
      </div>

      <div className="flex justify-center items-center mt-auto mb-10">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-primary text-white px-4 py-2 rounded-lg w-96 mt-10 h-14 text-lg disabled:opacity-50"
        >
          {isLoading ? "Memproses..." : "Selanjutnya"}
        </Button>
      </div>
    </form>
  );
};

export default SenderForm; 