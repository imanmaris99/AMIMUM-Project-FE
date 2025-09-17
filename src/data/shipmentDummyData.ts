import { ShipmentAddress, Courier, ShipmentData } from '@/types/shipment';

// Data dummy untuk alamat pengiriman
export const dummyShipmentAddresses: ShipmentAddress[] = [
  {
    id: 1,
    name: "Ahmad Wijaya",
    phone: "+6281234567890",
    address: "Jalan Patriot No. 15, Kecamatan Bayat",
    city: "Wonogiri",
    cityId: 123,
    state: "Jawa Tengah",
    country: "Indonesia",
    zipCode: "59191",
    isActive: true, // Hanya 1 yang aktif sebagai default
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    phone: "+6282345678901",
    address: "Jl. Sudirman No. 45, Kelurahan Menteng",
    city: "Jakarta Pusat",
    cityId: 124,
    state: "DKI Jakarta",
    country: "Indonesia",
    zipCode: "10310",
    isActive: false,
    createdAt: "2024-01-20T14:15:00Z"
  },
  {
    id: 3,
    name: "Budi Santoso",
    phone: "+6283456789012",
    address: "Perumahan Griya Asri Blok A-12",
    city: "Surabaya",
    cityId: 125,
    state: "Jawa Timur",
    country: "Indonesia",
    zipCode: "60217",
    isActive: false, // Diubah ke false
    createdAt: "2024-02-01T09:45:00Z"
  }
];

// Data dummy untuk kurir
export const dummyCouriers: Courier[] = [
  {
    id: 1,
    courierName: "JNE",
    serviceType: "REG",
    weight: 1000,
    cost: 15000,
    estimatedDelivery: "1-2 hari"
  },
  {
    id: 2,
    courierName: "JNE",
    serviceType: "EXPRESS",
    weight: 1000,
    cost: 25000,
    estimatedDelivery: "1 hari"
  },
  {
    id: 3,
    courierName: "J&T",
    serviceType: "REG",
    weight: 1000,
    cost: 12000,
    estimatedDelivery: "2-3 hari"
  },
  {
    id: 4,
    courierName: "J&T",
    serviceType: "EXPRESS",
    weight: 1000,
    cost: 20000,
    estimatedDelivery: "1-2 hari"
  },
  {
    id: 5,
    courierName: "Si Cepat",
    serviceType: "REG",
    weight: 1000,
    cost: 13000,
    estimatedDelivery: "2-3 hari"
  },
  {
    id: 6,
    courierName: "Si Cepat",
    serviceType: "EXPRESS",
    weight: 1000,
    cost: 22000,
    estimatedDelivery: "1 hari"
  }
];

// Data dummy untuk shipment lengkap
export const dummyShipments: ShipmentData[] = [
  {
    id: "ship-001",
    address: dummyShipmentAddresses[0],
    courier: dummyCouriers[0],
    isActive: true, // Hanya 1 yang aktif sebagai default
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "ship-002",
    address: dummyShipmentAddresses[1],
    courier: dummyCouriers[2],
    isActive: false,
    createdAt: "2024-01-20T14:15:00Z"
  },
  {
    id: "ship-003",
    address: dummyShipmentAddresses[2],
    courier: dummyCouriers[4],
    isActive: false, // Diubah ke false
    createdAt: "2024-02-01T09:45:00Z"
  }
];

// Data dummy untuk alamat toko (pengirim)
export const dummyStoreAddress = {
  name: "Toko Amimum",
  phone: "+6281234567890",
  address: "Jl. Raya Industri No. 88, Kawasan Industri",
  city: "Jakarta Selatan",
  cityId: 126,
  state: "DKI Jakarta",
  country: "Indonesia",
  zipCode: "12530"
};
