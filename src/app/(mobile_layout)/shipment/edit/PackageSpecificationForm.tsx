import { Button } from "@/components/ui/button";
import { HiOutlineTruck } from "react-icons/hi2";
import { PiPackageThin } from "react-icons/pi";
import React, { useState, useEffect } from "react";
import { PackageFormData } from "@/types/shipment";
import {
  getRajaOngkirShippingCost,
  RajaOngkirShippingDetail,
  SUPPORTED_COURIERS,
} from "@/services/api/rajaongkir";
import { toast } from "react-hot-toast";

interface PackageSpecificationFormProps {
  onSubmit: (data: PackageFormData) => void;
  onBack: () => void;
  initialData?: PackageFormData;
  originCityId?: string;
  destinationCityId?: string;
}

const CourierSelection = ({ 
  value, 
  onChange, 
  error 
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}) => (
  <div className="flex flex-col gap-2 relative">
    <label htmlFor="courier">Jasa Kurir</label>
    <HiOutlineTruck className="text-xl absolute left-2 top-9 stroke-1" />
    <select 
      name="courier" 
      id="courier" 
      value={value}
      onChange={onChange}
      className={`border rounded-md outline-none px-2 py-1 pl-9 text-sm bg-gray-200 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      <option value="">Pilih Kurir</option>
      {SUPPORTED_COURIERS.map((courier) => (
        <option key={courier.id} value={courier.id}>
          {courier.name}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    )}
  </div>
);

const WeightInput = ({ 
  value, 
  onChange, 
  error 
}: { 
  value: number; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) => (
  <div className="flex flex-col gap-2 relative">
    <label htmlFor="weight">Berat (gram)</label>
    <PiPackageThin className="text-xl absolute left-2 top-9 stroke-1" />
    <input
      type="number"
      name="weight"
      id="weight"
      value={value}
      onChange={onChange}
      placeholder="Masukkan berat paket"
      className={`border rounded-md outline-none px-2 py-1 pl-10 bg-gray-200 text-sm ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      min={0}
    />
    <span className="absolute right-2 top-12 transform -translate-y-1/2 text-gray-500 text-sm font-semibold">gram</span>
    {error && (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    )}
  </div>
);

const DimensionInputs = ({ 
  values, 
  onChange, 
  errors 
}: { 
  values: { length: number; width: number; height: number }; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: { length?: string; width?: string; height?: string };
}) => (
  <div className="flex flex-col gap-2">
    <label htmlFor="length">Dimensi Paket</label>
    <div className="flex gap-2">
      {[
        { key: 'length', placeholder: 'Panjang', value: values.length },
        { key: 'width', placeholder: 'Lebar', value: values.width },
        { key: 'height', placeholder: 'Tinggi', value: values.height }
      ].map(({ key, placeholder, value }) => (
        <div className="relative flex-1" key={key}>
          <input
            type="number"
            name={key}
            id={key}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`border rounded-md outline-none px-2 py-1 bg-gray-200 w-full text-sm ${
              errors?.[key as keyof typeof errors] ? 'border-red-500' : 'border-gray-300'
            }`}
            min={0}
          />
          <span className="text-gray-500 text-sm font-semibold absolute right-2 top-1/2 transform -translate-y-1/2">cm</span>
        </div>
      ))}
    </div>
    {errors && Object.values(errors).some(error => error) && (
      <div className="flex flex-col gap-1">
        {errors.length && <p className="text-red-500 text-xs">{errors.length}</p>}
        {errors.width && <p className="text-red-500 text-xs">{errors.width}</p>}
        {errors.height && <p className="text-red-500 text-xs">{errors.height}</p>}
      </div>
    )}
  </div>
);

const ShippingCostCalculation = ({ 
  onCalculate, 
  isLoading 
}: { 
  onCalculate: () => void;
  isLoading: boolean;
}) => (
  <div className="flex justify-center items-center mt-6 border-b border-gray-300 pb-6">
    <Button 
      type="button" 
      onClick={onCalculate}
      disabled={isLoading}
      className="w-full font-semibold rounded-lg disabled:opacity-50" 
      variant="outline"
    >
      {isLoading ? "Menghitung..." : "Kalkulasi Biaya Pengiriman"}
    </Button>
  </div>
);

const ShippingCostDetails = ({ 
  couriers,
  selectedService, 
  onServiceChange, 
  cost, 
  estimatedDelivery, 
  serviceType 
}: { 
  couriers: RajaOngkirShippingDetail[];
  selectedService: string;
  onServiceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  cost: number;
  estimatedDelivery: string;
  serviceType: string;
}) => (
  <div className="bg-white rounded-lg p-4 flex flex-col gap-4">
    <div className="flex flex-col justify-center items-center">
      <h6 className="font-semibold">Detail Biaya Pengiriman</h6>
      <p className="text-sm text-gray-500">Pilih Layanan</p>
    </div>
    <div>
      <select 
        name="select-service" 
        id="select-service" 
        value={selectedService}
        onChange={onServiceChange}
        className="w-full border border-gray-300 rounded-md outline-none px-2 py-1 bg-gray-200"
      >
        <option value="">Pilih Layanan</option>
        {couriers.map((courier) => (
          <option key={courier.service} value={courier.service}>
            {courier.service} - {courier.description}
          </option>
        ))}
      </select>
    </div>
    {selectedService && (
      <div className="mt-6">
        <div className="flex flex-col gap-3">
          <div className="bg-blue-50 rounded-md px-2 py-2">
            <p className="text-sm font-semibold text-blue-800">Tipe Layanan: {serviceType}</p>
          </div>
          <div className="bg-green-50 rounded-md px-2 py-2">
            <p className="text-sm font-semibold text-green-800">Biaya Kirim: Rp {cost.toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 rounded-md px-2 py-2">
            <p className="text-sm font-semibold text-orange-800">Estimasi Pengiriman: {estimatedDelivery}</p>
          </div>
        </div>
      </div>
    )}
  </div>
);

const PackageSpecificationForm: React.FC<PackageSpecificationFormProps> = ({
  onSubmit,
  onBack,
  initialData,
  originCityId,
  destinationCityId,
}) => {
  const [formData, setFormData] = useState<PackageFormData>({
    courier: "",
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    serviceType: "",
    cost: 0,
    estimatedDelivery: ""
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [availableServices, setAvailableServices] = useState<RajaOngkirShippingDetail[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setSelectedService(initialData.serviceType);
      setAvailableServices([
        {
          service: initialData.serviceType,
          description: "Layanan tersimpan",
          cost: initialData.cost,
          etd: initialData.estimatedDelivery,
        },
      ]);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      courier: prev.courier || SUPPORTED_COURIERS[0].id,
    }));
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.courier.trim()) {
      newErrors.courier = "Jasa kurir harus dipilih";
    }

    if (!formData.weight || formData.weight <= 0) {
      newErrors.weight = "Berat paket harus diisi dan lebih dari 0";
    }

    if (!formData.length || formData.length <= 0) {
      newErrors.length = "Panjang paket harus diisi dan lebih dari 0";
    }

    if (!formData.width || formData.width <= 0) {
      newErrors.width = "Lebar paket harus diisi dan lebih dari 0";
    }

    if (!formData.height || formData.height <= 0) {
      newErrors.height = "Tinggi paket harus diisi dan lebih dari 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weight' || name === 'length' || name === 'width' || name === 'height' 
        ? Number(value) || 0 
        : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedService(value);
    
    if (value) {
      const courier = availableServices.find((item) => item.service === value);
      
      if (courier) {
        setFormData(prev => ({
          ...prev,
          serviceType: courier.service,
          cost: courier.cost || 0,
          estimatedDelivery: courier.etd || ""
        }));
      }
    }
  };

  const handleCalculate = async () => {
    if (!validateForm()) {
      return;
    }

    if (!originCityId || !destinationCityId) {
      toast.error("Data kota asal dan tujuan belum lengkap.");
      return;
    }

    setIsCalculating(true);

    try {
      const response = await getRajaOngkirShippingCost({
        origin: Number(originCityId),
        destination: Number(destinationCityId),
        weight: formData.weight,
        courier: formData.courier,
      });

      setAvailableServices(response.details);

      const firstService = response.details[0];
      setFormData((prev) => ({
        ...prev,
        serviceType: firstService?.service || prev.serviceType,
        cost: firstService?.cost || prev.cost,
        estimatedDelivery: firstService?.etd || prev.estimatedDelivery,
      }));
      setSelectedService(firstService?.service || "");
      toast.success("Biaya pengiriman berhasil dihitung.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menghitung biaya pengiriman."
      );
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    onSubmit(formData);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 px-10 py-4 w-full">
      <div className="flex flex-col gap-4">
        <CourierSelection 
          value={formData.courier}
          onChange={handleInputChange}
          error={errors.courier}
        />
        <WeightInput 
          value={formData.weight}
          onChange={handleInputChange}
          error={errors.weight}
        />
        <DimensionInputs 
          values={{
            length: formData.length,
            width: formData.width,
            height: formData.height
          }}
          onChange={handleInputChange}
          errors={{
            length: errors.length,
            width: errors.width,
            height: errors.height
          }}
        />
        <ShippingCostCalculation 
          onCalculate={handleCalculate}
          isLoading={isCalculating}
        />
        <ShippingCostDetails 
          couriers={availableServices}
          selectedService={selectedService}
          onServiceChange={handleServiceChange}
          cost={formData.cost}
          estimatedDelivery={formData.estimatedDelivery}
          serviceType={formData.serviceType}
        />
      </div>
      <div className="flex justify-center items-center gap-2">
        <Button 
          type="button" 
          onClick={onBack} 
          className="bg-gray-500 text-white px-4 py-2 rounded-lg w-48 mt-10 h-14 text-lg"
        >
          Kembali
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-primary text-white px-4 py-2 rounded-lg w-48 mt-10 h-14 text-lg disabled:opacity-50"
        >
          {isLoading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
};

export default PackageSpecificationForm; 
