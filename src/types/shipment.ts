// Types untuk Shipment sesuai dengan backend DTOs
export interface ShipmentAddress {
  id: number;
  name: string;
  phone: string; // Format: +62xxxxxxxxxx
  address?: string;
  city?: string;
  city_id?: number;
  state?: string;
  country?: string;
  zip_code?: number;
  created_at: string;
}

// Untuk create address
export interface ShipmentAddressCreate {
  name: string;
  phone: string; // Format: +62xxxxxxxxxx
  address?: string;
  city?: string;
  city_id?: number;
  state?: string;
  country?: string;
  zip_code?: number;
}

export interface Courier {
  id: number;
  courier_name: string; // 'jne', 'pos', 'tiki'
  weight: number;
  phone_number?: string;
  service_type?: string;
  length?: number;
  width?: number;
  height?: number;
  cost?: number;
  estimated_delivery?: string;
  is_active: boolean;
  created_at: string;
}

// Untuk create courier
export interface CourierCreate {
  courier_name: 'jne' | 'pos' | 'tiki';
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  service_type?: string;
  cost?: number;
  estimated_delivery?: string;
}

// New types for hierarchical courier selection
export interface CourierService {
  id: string;
  serviceType: string;
  cost: number;
  estimatedDelivery: string;
  description: string;
  weight: number;
}

export interface CourierCompany {
  id: string;
  name: string;
  logo?: string;
  services: CourierService[];
}

export interface ShipmentData {
  id: string;
  address: ShipmentAddress;
  courier: Courier;
  is_active: boolean;
  created_at: string;
}

// Untuk create shipment
export interface ShipmentCreate {
  address: ShipmentAddressCreate;
  courier: CourierCreate;
}

// Response DTOs sesuai backend
export interface ShipmentInfo {
  shipment_id: string;
  courier_id: number;
  address_id: number;
  code_tracking: string;
  created_at: string;
  is_active: boolean;
}

export interface ShipmentResponse {
  status_code: number;
  message: string;
  data: ShipmentInfo;
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
