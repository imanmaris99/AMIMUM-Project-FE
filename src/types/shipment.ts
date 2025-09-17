// Types untuk Shipment dengan data dummy
export interface ShipmentAddress {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  cityId: number;
  state: string;
  country: string;
  zipCode: string;
  isActive: boolean;
  createdAt: string;
}

export interface Courier {
  id: number;
  courierName: string;
  serviceType: string;
  weight: number;
  cost: number;
  estimatedDelivery: string;
}

export interface ShipmentData {
  id: string;
  address: ShipmentAddress;
  courier: Courier;
  isActive: boolean;
  createdAt: string;
}

export interface SenderFormData {
  senderName: string;
  phoneNumber: string;
  country: string;
  province: string;
  city: string;
  cityId: string;
  postalCode: string;
  fullAddress: string;
}

export interface ReceiverFormData {
  receiverName: string;
  phoneNumber: string;
  country: string;
  province: string;
  city: string;
  cityId: string;
  postalCode: string;
  fullAddress: string;
}

export interface PackageFormData {
  courier: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  serviceType: string;
  cost: number;
  estimatedDelivery: string;
}
