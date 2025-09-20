import { ShipmentAddress, Courier, ShipmentData, CourierCompany, CourierService } from '@/types/shipment';

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

// Data dummy untuk kurir (legacy format)
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

// Data kurir terstruktur untuk dropdown bertingkat
export const courierCompanies: CourierCompany[] = [
  {
    id: "jne",
    name: "JNE",
    logo: "/jne-logo.png",
    services: [
      {
        id: "jne-oke",
        serviceType: "OKE",
        cost: 12000,
        estimatedDelivery: "4-5 hari kerja",
        description: "Pengiriman ekonomis dengan harga terjangkau",
        weight: 1000
      },
      {
        id: "jne-reg",
        serviceType: "REG",
        cost: 15000,
        estimatedDelivery: "2-3 hari kerja",
        description: "Pengiriman standar dengan harga terjangkau",
        weight: 1000
      },
      {
        id: "jne-yes",
        serviceType: "YES",
        cost: 25000,
        estimatedDelivery: "1-2 hari kerja",
        description: "Pengiriman ekspres dengan jaminan waktu",
        weight: 1000
      }
    ]
  },
  {
    id: "jnt",
    name: "J&T",
    logo: "/jnt-logo.png",
    services: [
      {
        id: "jnt-regular",
        serviceType: "Regular",
        cost: 12000,
        estimatedDelivery: "2-3 hari kerja",
        description: "Pengiriman standar dengan tracking lengkap",
        weight: 1000
      },
      {
        id: "jnt-express",
        serviceType: "Express",
        cost: 20000,
        estimatedDelivery: "1-2 hari kerja",
        description: "Pengiriman cepat dengan prioritas tinggi",
        weight: 1000
      }
    ]
  },
  {
    id: "sicepat",
    name: "Si Cepat",
    logo: "/sicepat-logo.png",
    services: [
      {
        id: "sicepat-regular",
        serviceType: "Regular",
        cost: 13000,
        estimatedDelivery: "2-3 hari kerja",
        description: "Pengiriman standar dengan layanan terpercaya",
        weight: 1000
      },
      {
        id: "sicepat-express",
        serviceType: "Express",
        cost: 22000,
        estimatedDelivery: "1 hari kerja",
        description: "Pengiriman super cepat dengan jaminan hari ini",
        weight: 1000
      }
    ]
  },
  {
    id: "tiki",
    name: "TIKI",
    logo: "/tiki-logo.png",
    services: [
      {
        id: "tiki-regular",
        serviceType: "Regular",
        cost: 18000,
        estimatedDelivery: "2-3 hari kerja",
        description: "Pengiriman standar dengan layanan profesional",
        weight: 1000
      },
      {
        id: "tiki-ons",
        serviceType: "ONS",
        cost: 30000,
        estimatedDelivery: "1 hari kerja",
        description: "Pengiriman overnight dengan jaminan keesokan harinya",
        weight: 1000
      }
    ]
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
