"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoChevronLeft, GoLocation, GoPackage, GoCreditCard, GoPlus } from 'react-icons/go';
import { IoCheckmarkCircle, IoWarning } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import rupiahFormater from '@/utils/rupiahFormater';
import { useCart, CartItemType } from '@/contexts/CartContext';
import CourierSelector from './CourierSelector';
import { courierCompanies } from '@/data/shipmentDummyData';

interface Order1PageProps {
  onBack?: () => void;
}

// Using CartItemType from CartContext

// Removed local interfaces - now using CourierCompany and CourierService from types/shipment.ts

interface AddressInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
}

const Order1Page: React.FC<Order1PageProps> = ({ onBack }) => {
  const router = useRouter();
  const { cartItems, totalPrices, clearCart } = useCart();
  
  // State management
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  // Courier state - using hierarchical selection
  const [selectedCourierCompany, setSelectedCourierCompany] = useState<string>('');
  const [selectedCourierService, setSelectedCourierService] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  // Address state
  const [addresses, setAddresses] = useState<AddressInfo[]>([
    {
      name: "John Doe",
      phone: "+62 812-3456-7890",
      address: "Jl. Sudirman No. 123, RT 01/RW 02, Kelurahan Menteng",
      city: "Jakarta Pusat",
      postal_code: "10310"
    }
  ]);
  const [selectedAddress, setSelectedAddress] = useState<AddressInfo | null>(addresses[0]);

  // Get selected courier service data for calculations
  const selectedCourierData = courierCompanies
    .find(company => company.id === selectedCourierCompany)
    ?.services.find(service => service.id === selectedCourierService);

  // Calculate totals
  const subtotal = totalPrices.all_item_active_prices || 0;
  const discount = totalPrices.all_item_active_prices - totalPrices.total_all_active_prices || 0;
  const shippingCost = deliveryMethod === 'delivery' ? (selectedCourierData?.cost || 0) : 0;
  const total = totalPrices.total_all_active_prices + shippingCost;

  // Validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!selectedAddress) {
      newErrors.address = 'Alamat pengiriman harus dipilih';
    }
    
    if (deliveryMethod === 'delivery' && (!selectedCourierCompany || !selectedCourierService)) {
      newErrors.courier = 'Ekspedisi dan layanan pengiriman harus dipilih';
    }
    
    if (cartItems.length === 0) {
      newErrors.cart = 'Keranjang kosong';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  // Clear specific error when user makes changes
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      toast.error('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order data based on backend DTOs
      const orderData = {
        delivery_type: deliveryMethod,
        notes: deliveryMethod === 'pickup' ? 'Ambil di toko' : undefined,
        shipment_id: deliveryMethod === 'delivery' ? selectedCourierService : undefined,
        items: cartItems.map((item: CartItemType) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity
        }))
      };
      
      console.log('Order data:', orderData);
      
      // Clear cart after successful payment
      console.log('🧹 Order1Page: Clearing cart after payment...');
      clearCart();
      console.log('🧹 Order1Page: Cart cleared successfully');
      
      toast.success('Pesanan berhasil dibuat! Keranjang telah dikosongkan.');
      
      // Navigate to payment or order confirmation
      // router.push('/payment');
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Terjadi kesalahan saat memproses pesanan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = () => {
    setShowAddressModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <GoChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Checkout</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-sm mx-auto bg-white min-h-screen">
        {/* Error Messages */}
        {Object.keys(errors).length > 0 && (
          <div className="px-4 py-3 bg-red-50 border-l-4 border-red-400">
            <div className="flex">
              <IoWarning className="w-5 h-5 text-red-400 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-red-700 font-medium">Perhatian:</p>
                <ul className="text-sm text-red-600 mt-1">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Method Selection */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Metode Penerima Pesanan</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              deliveryMethod === 'delivery' 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-primary/50'
            }`}>
              <input
                type="radio"
                name="deliveryMethod"
                value="delivery"
                checked={deliveryMethod === 'delivery'}
                onChange={(e) => setDeliveryMethod(e.target.value as 'delivery' | 'pickup')}
                className="sr-only"
              />
              <div className="text-center">
                <GoPackage className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">Kirim ke tujuan</span>
              </div>
            </label>
            <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              deliveryMethod === 'pickup' 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-primary/50'
            }`}>
              <input
                type="radio"
                name="deliveryMethod"
                value="pickup"
                checked={deliveryMethod === 'pickup'}
                onChange={(e) => setDeliveryMethod(e.target.value as 'delivery' | 'pickup')}
                className="sr-only"
              />
              <div className="text-center">
                <GoLocation className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">Ambil di toko</span>
              </div>
            </label>
          </div>
        </div>

        {/* Cart Items */}
        <div className="px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Produk Pesanan</h2>
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <GoPackage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Keranjang kosong</p>
              <button
                onClick={() => router.push('/')}
                className="mt-2 text-primary font-medium text-sm hover:underline"
              >
                Mulai belanja
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item: CartItemType) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                    <img 
                      src={item.variant_info.img || "/default-image.jpg"} 
                      alt={item.product_name} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{item.product_name}</h3>
                    <p className="text-xs text-gray-600">{item.variant_info.variant}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-medium text-gray-900">
                        {rupiahFormater(item.variant_info.discounted_price || item.product_price)}
                      </span>
                      {item.variant_info.discount > 0 && (
                        <>
                          <span className="text-xs text-gray-500 line-through">
                            {rupiahFormater(item.product_price)}
                          </span>
                          <span className="bg-red-100 text-red-600 px-1 py-0.5 rounded text-[10px] font-bold">
                            -{item.variant_info.discount}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {rupiahFormater((item.variant_info.discounted_price || item.product_price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Address Section */}
        {deliveryMethod === 'delivery' && (
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Alamat Pengiriman</h2>
              <button
                onClick={handleAddAddress}
                className="text-primary text-sm font-medium hover:underline flex items-center"
              >
                <GoPlus className="w-4 h-4 mr-1" />
                Tambah
              </button>
            </div>
            
            {/* Store Address */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-800 font-medium mb-2">Alamat pengirim</p>
              <div className="flex items-start space-x-3">
                <GoLocation className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Amimum Herbal Store</p>
                  <p className="text-sm text-gray-600">+62 812-3456-7890</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Jl. Silugonggo No. 15, Kelurahan Pati Wetan, Kecamatan Pati, Kota Pati, Kode Pos 59185, Jawa Tengah, Indonesia
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="p-3 border-2 border-dashed border-gray-200 rounded-lg">
              <p className="text-sm text-gray-800 font-medium mb-2">Alamat tujuan</p>
              {selectedAddress ? (
                <div className="flex items-start space-x-3">
                  <GoLocation className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedAddress.name}</p>
                    <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedAddress.address}, {selectedAddress.city} {selectedAddress.postal_code}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleAddAddress();
                      clearError('address');
                    }}
                    className="text-primary text-xs font-medium hover:underline"
                  >
                    Ubah
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleAddAddress();
                    clearError('address');
                  }}
                  className="w-full text-center py-4 text-gray-500 hover:text-primary transition-colors"
                >
                  <GoPlus className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm">Pilih alamat pengiriman</p>
                </button>
              )}
            </div>
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>
        )}

        {/* Pickup Information */}
        {deliveryMethod === 'pickup' && (
          <div className="px-4 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pengambilan</h2>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <GoLocation className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Amimum Herbal Store</p>
                  <p className="text-sm text-gray-600">+62 812-3456-7890</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Jl. Silugonggo No. 15, Kelurahan Pati Wetan, Kecamatan Pati, Kota Pati, Kode Pos 59185, Jawa Tengah, Indonesia
                  </p>
                  <p className="text-sm text-blue-600 font-medium mt-2">
                    Jam operasional: 08:00 - 17:00 WIB
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courier Selection */}
        {deliveryMethod === 'delivery' && (
          <div className="px-4 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pilih Kurir</h2>
            <CourierSelector
              courierCompanies={courierCompanies}
              selectedCompany={selectedCourierCompany}
              selectedService={selectedCourierService}
              onCompanySelect={(companyId) => {
                setSelectedCourierCompany(companyId);
                clearError('courier');
              }}
              onServiceSelect={(serviceId) => {
                setSelectedCourierService(serviceId);
                clearError('courier');
              }}
              isLoading={isLoading}
            />
            {errors.courier && (
              <p className="text-red-500 text-xs mt-2">{errors.courier}</p>
            )}
          </div>
        )}

        {/* Payment Summary */}
        <div className="px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pembayaran</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal ({cartItems.length} item)</span>
              <span className="font-medium">{rupiahFormater(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Diskon</span>
                <span className="font-medium text-red-500">-{rupiahFormater(discount)}</span>
              </div>
            )}
            {deliveryMethod === 'delivery' && shippingCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ongkir</span>
                <span className="font-medium">{rupiahFormater(shippingCost)}</span>
              </div>
            )}
            {deliveryMethod === 'pickup' && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pengambilan</span>
                <span className="font-medium text-green-600">Gratis</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">{rupiahFormater(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Metode Pembayaran</h2>
            <button className="text-primary text-sm font-medium hover:underline">
              Ubah
            </button>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <GoCreditCard className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Credit Card</p>
              <p className="text-sm text-gray-600">**** **** **** 1234</p>
            </div>
            <IoCheckmarkCircle className="w-5 h-5 text-green-500" />
          </div>
        </div>

        {/* Payment Button */}
        <div className="px-4 py-6 bg-white sticky bottom-0">
          <button
            onClick={handlePayment}
            disabled={isLoading || cartItems.length === 0}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
              isLoading || cartItems.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90 active:scale-95'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Memproses...
              </div>
            ) : (
              `Bayar ${rupiahFormater(total)}`
            )}
          </button>
          
          {cartItems.length === 0 && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Keranjang kosong, tidak dapat melanjutkan pembayaran
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order1Page;
