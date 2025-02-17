import { Button } from "@/components/ui/button";
import { HiOutlineTruck } from "react-icons/hi2";
import { PiPackageThin } from "react-icons/pi";
import React from "react";
import { useRouter } from "next/navigation";
interface PackageSpecificationFormProps {
  onSubmit: (event: React.FormEvent) => void;
  onBack: () => void;
}

const CourierSelection = () => (
  <div className="flex flex-col gap-2 relative">
    <label htmlFor="courier">Jasa Kurir</label>
    <HiOutlineTruck className="text-xl absolute left-2 top-9 stroke-1" />
    <select name="courier" id="courier" className="border border-gray-300 rounded-md outline-none px-2 py-1 pl-9 text-sm bg-gray-200">
      <option value="jne">JNE</option>
      <option value="jnt">J&T</option>
      <option value="sicepat">Si Cepat</option>
    </select>
  </div>
);

const WeightInput = () => (
  <div className="flex flex-col gap-2 relative">
    <label htmlFor="weight">Berat (gram)</label>
    <PiPackageThin className="text-xl absolute left-2 top-9 stroke-1" />
    <input
      type="number"
      name="weight"
      id="weight"
      placeholder="Masukkan berat paket"
      className="border border-gray-300 rounded-md outline-none px-2 py-1 pl-10 bg-gray-200 text-sm"
      min={0}
    />
    <span className="absolute right-2 top-12 transform -translate-y-1/2 text-gray-500 text-sm font-semibold">gram</span>
  </div>
);

const DimensionInputs = () => (
  <div className="flex flex-col gap-2">
    <label htmlFor="length">Dimensi Paket</label>
    <div className="flex gap-2">
      {['Panjang', 'Lebar', 'Tinggi'].map((placeholder, index) => (
        <div className="relative flex-1" key={index}>
          <input
            type="number"
            name={placeholder.toLowerCase()}
            id={placeholder.toLowerCase()}
            placeholder={placeholder}
            className="border border-gray-300 rounded-md outline-none px-2 py-1 bg-gray-200 w-full text-sm"
          />
          <span className="text-gray-500 text-sm font-semibold absolute right-2 top-1/2 transform -translate-y-1/2">cm</span>
        </div>
      ))}
    </div>
  </div>
);

const ShippingCostCalculation = () => (
  <div className="flex justify-center items-center mt-6 border-b border-gray-300 pb-6">
    <Button type="button" className="w-full font-semibold rounded-lg" variant="outline">Kalkulasi Biaya Pengiriman</Button>
  </div>
);

const ShippingCostDetails = () => (
  <div className="bg-white rounded-lg p-4 flex flex-col gap-4">
    <div className="flex flex-col justify-center items-center">
      <h6 className="font-semibold">Detail Biaya Pengiriman</h6>
      <p className="text-sm text-gray-500">Pilih Layanan</p>
    </div>
    <div>
      <select name="select-service" id="select-service" className="w-full border border-gray-300 rounded-md outline-none px-2 py-1 bg-gray-200">
        <option value="">Pilih Layanan</option>
        <option value="jne">JNE</option>
        <option value="jnt">J&T</option>
        <option value="sicepat">Si Cepat</option>
      </select>
    </div>
    <div className="mt-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-500 bg-gray-200 rounded-md px-2 py-2">Tipe Layanan</p>
        <p className="text-sm text-gray-500 bg-gray-200 rounded-md px-2 py-2">Biaya Kirim</p>
        <p className="text-sm text-gray-500 bg-gray-200 rounded-md px-2 py-2">Estimasi Pengiriman</p>
      </div>
    </div>
  </div>
);

const PackageSpecificationForm: React.FC<PackageSpecificationFormProps> = ({ onSubmit, onBack }) => {
  const router = useRouter();
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(event);
    router.push("/shipment");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 px-10 py-4 w-full">
      <div className="flex flex-col gap-4">
        <CourierSelection />
        <WeightInput />
        <DimensionInputs />
        <ShippingCostCalculation />
        <ShippingCostDetails />
      </div>
      <div className="flex justify-center items-center gap-2">
        <Button type="button" className="bg-primary text-white px-4 py-2 rounded-lg w-96 mt-10 h-14 text-lg" variant="default" onClick={onBack}>Kembali</Button>
        <Button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg w-96 mt-10 h-14 text-lg" variant="default" onClick={handleSubmit}>Simpan</Button>
      </div>
    </form>
  );
};

export default PackageSpecificationForm; 