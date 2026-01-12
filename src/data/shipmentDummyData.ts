import { ShipmentAddress, Courier, ShipmentData, CourierCompany } from '@/types/shipment';

// Data dummy untuk alamat pengiriman sesuai backend DTOs
export const dummyShipmentAddresses: ShipmentAddress[] = [
  {
    id: 1,
    name: "Ahmad Wijaya",
    phone: "+6281234567890",
    address: "Jalan Patriot No. 15, Kecamatan Bayat",
    city: "Wonogiri",
    city_id: 123,
    state: "Jawa Tengah",
    country: "Indonesia",
    zip_code: 59191,
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    phone: "+6282345678901",
    address: "Jl. Sudirman No. 45, Kelurahan Menteng",
    city: "Jakarta Pusat",
    city_id: 124,
    state: "DKI Jakarta",
    country: "Indonesia",
    zip_code: 10310,
    created_at: "2024-01-20T14:15:00Z"
  },
  {
    id: 3,
    name: "Budi Santoso",
    phone: "+6283456789012",
    address: "Perumahan Griya Asri Blok A-12",
    city: "Surabaya",
    city_id: 125,
    state: "Jawa Timur",
    country: "Indonesia",
    zip_code: 60217,
    created_at: "2024-02-01T09:45:00Z"
  }
];

// Data dummy untuk kurir sesuai backend DTOs
export const dummyCouriers: Courier[] = [
  {
    id: 1,
    courier_name: "jne",
    weight: 1000,
    service_type: "REG",
    cost: 15000,
    estimated_delivery: "1-2 hari",
    is_active: true,
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    courier_name: "jne",
    weight: 1000,
    service_type: "EXPRESS",
    cost: 25000,
    estimated_delivery: "1 hari",
    is_active: true,
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 3,
    courier_name: "pos",
    weight: 1000,
    service_type: "REG",
    cost: 12000,
    estimated_delivery: "2-3 hari",
    is_active: true,
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 4,
    courier_name: "pos",
    weight: 1000,
    service_type: "EXPRESS",
    cost: 20000,
    estimated_delivery: "1-2 hari",
    is_active: true,
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 5,
    courier_name: "tiki",
    weight: 1000,
    service_type: "REG",
    cost: 13000,
    estimated_delivery: "2-3 hari",
    is_active: true,
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 6,
    courier_name: "tiki",
    weight: 1000,
    service_type: "EXPRESS",
    cost: 22000,
    estimated_delivery: "1 hari",
    is_active: true,
    created_at: "2024-01-15T10:30:00Z"
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

// Data dummy untuk shipment lengkap sesuai backend DTOs
export const dummyShipments: ShipmentData[] = [
  {
    id: "ship-001",
    address: dummyShipmentAddresses[0],
    courier: dummyCouriers[0],
    is_active: true,
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "ship-002",
    address: dummyShipmentAddresses[1],
    courier: dummyCouriers[2],
    is_active: false,
    created_at: "2024-01-20T14:15:00Z"
  },
  {
    id: "ship-003",
    address: dummyShipmentAddresses[2],
    courier: dummyCouriers[4],
    is_active: false,
    created_at: "2024-02-01T09:45:00Z"
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
