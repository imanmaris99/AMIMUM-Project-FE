"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GoChevronLeft, GoLocation, GoPackage, GoPlus } from 'react-icons/go';
import { IoCheckmarkCircle, IoWarning } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import rupiahFormater from '@/utils/rupiahFormater';
import ButtonSpinner from '@/components/ui/ButtonSpinner';
import { useCart } from '@/contexts/CartContext';
import { CartItemType } from '@/types/apiTypes';
import { useTransaction } from '@/contexts/TransactionContext';
import CourierSelector from './CourierSelector';
import AddressSelector from './AddressSelector';
import { CourierCompany } from '@/types/shipment';
import { TransactionPaymentMethod } from '@/types/transaction';
import {
  getPaymentMethodGroups,
  requiresPendingPayment,
  PaymentMethodGroup,
} from '@/lib/paymentMethods';
import {
  getMyShipmentAddresses,
  getOwnerShipmentAddress,
} from '@/services/api/shipment-address';
import {
  getRajaOngkirShippingCost,
  getRajaOngkirCities,
  getRajaOngkirProvinces,
  SUPPORTED_COURIERS,
} from '@/services/api/rajaongkir';

interface Order1PageProps {
  onBack?: () => void;
}

// Using CartItemType from CartContext

interface AddressInfo {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  city_id?: number;
  postal_code: string;
  isDefault?: boolean;
}

interface StoreAddressInfo {
  name: string;
  phone: string;
  address: string;
  cityId?: number;
}

const normalizeAreaName = (value: string) =>
  value
    .toUpperCase()
    .replace(/^KOTA\s+/g, '')
    .replace(/^KABUPATEN\s+/g, '')
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const resolveCityIdFromRajaOngkir = async (
  provinceName: string,
  cityName: string
): Promise<number | undefined> => {
  const provinces = await getRajaOngkirProvinces();
  const matchedProvince = provinces.find(
    (province) =>
      normalizeAreaName(province.province) === normalizeAreaName(provinceName)
  );

  if (!matchedProvince) {
    return undefined;
  }

  const cities = await getRajaOngkirCities(matchedProvince.province_id);
  const matchedCity = cities.find(
    (city) => normalizeAreaName(city.city_name) === normalizeAreaName(cityName)
  );

  return matchedCity?.city_id;
};

const Order1Page: React.FC<Order1PageProps> = ({ onBack }) => {
  const router = useRouter();
  const { cartItems, totalPrices, removeActiveItems } = useCart();
  const { addTransaction } = useTransaction();
  
  // Direct checkout state
  const [isDirectCheckout, setIsDirectCheckout] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<CartItemType | null>(null);
  
  // State management
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<TransactionPaymentMethod | null>(null);
  // Courier state - using hierarchical selection
  const [selectedCourierCompany, setSelectedCourierCompany] = useState<string>('');
  const [selectedCourierService, setSelectedCourierService] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  
  const [addresses, setAddresses] = useState<AddressInfo[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressInfo | null>(null);
  const [storeAddress, setStoreAddress] = useState<StoreAddressInfo | null>(null);
  const [courierCompanies, setCourierCompanies] = useState<CourierCompany[]>([]);
  const [isReferenceLoading, setIsReferenceLoading] = useState(true);
  const [isCourierLoading, setIsCourierLoading] = useState(false);
  const [expandedPaymentGroups, setExpandedPaymentGroups] = useState<
    Record<string, boolean>
  >({});

  const paymentMethodGroups = getPaymentMethodGroups(deliveryMethod);

  useEffect(() => {
    const loadReferences = async () => {
      setIsReferenceLoading(true);

      try {
        const [addressResponse, ownerResponse] = await Promise.all([
          getMyShipmentAddresses(),
          getOwnerShipmentAddress(),
        ]);

        const shipmentAddresses: AddressInfo[] = await Promise.all(
          addressResponse.data.map(async (address) => ({
            id: address.id.toString(),
            name: address.name,
            phone: address.phone,
            address: address.address || '',
            city: address.city || '',
            state: address.state || '',
            city_id:
              address.city_id ||
              (address.state && address.city
                ? await resolveCityIdFromRajaOngkir(address.state, address.city)
                : undefined),
            postal_code: address.zip_code?.toString() || '',
            isDefault: false,
          }))
        );

        setAddresses(shipmentAddresses);
        setSelectedAddress(shipmentAddresses[0] || null);
        setStoreAddress({
          name: ownerResponse.data.name,
          phone: ownerResponse.data.phone,
          cityId: ownerResponse.data.city_id,
          address: [
            ownerResponse.data.address,
            ownerResponse.data.city,
            ownerResponse.data.state,
            ownerResponse.data.zip_code,
            ownerResponse.data.country,
          ]
            .filter(Boolean)
            .join(', '),
        });
        setCourierCompanies(
          SUPPORTED_COURIERS.map((courier) => ({
            id: courier.id,
            name: courier.name,
            services: [],
          }))
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Gagal mengambil data checkout.'
        );
      } finally {
        setIsReferenceLoading(false);
      }
    };

    loadReferences();
  }, []);

  useEffect(() => {
    const loadCourierServices = async () => {
      if (
        deliveryMethod !== 'delivery' ||
        !selectedCourierCompany ||
        !selectedAddress?.city_id ||
        !storeAddress?.cityId
      ) {
        return;
      }

      setIsCourierLoading(true);

      try {
        const response = await getRajaOngkirShippingCost({
          origin: storeAddress.cityId,
          destination: selectedAddress.city_id,
          weight: 1000,
          courier: selectedCourierCompany,
        });

        setCourierCompanies((prevCompanies) =>
          prevCompanies.map((company) =>
            company.id === selectedCourierCompany
              ? {
                  ...company,
                  services: response.details.map((detail) => ({
                    id: `${selectedCourierCompany}-${detail.service}`,
                    serviceType: detail.service,
                    cost: detail.cost,
                    estimatedDelivery: detail.etd,
                    description: detail.description,
                    weight: 1000,
                  })),
                }
              : company
          )
        );
      } catch (error) {
        setCourierCompanies((prevCompanies) =>
          prevCompanies.map((company) =>
            company.id === selectedCourierCompany
              ? {
                  ...company,
                  services: [],
                }
              : company
          )
        );
        toast.error(
          error instanceof Error
            ? error.message
            : 'Gagal mengambil layanan kurir.'
        );
      } finally {
        setIsCourierLoading(false);
      }
    };

    loadCourierServices();
  }, [deliveryMethod, selectedCourierCompany, selectedAddress, storeAddress]);

  useEffect(() => {
    const availableMethods = paymentMethodGroups
      .flatMap((group) => group.methods)
      .filter((method) => method.isAvailable)
      .map((option) => option.id);

    if (selectedPaymentMethod && !availableMethods.includes(selectedPaymentMethod)) {
      setSelectedPaymentMethod(null);
    }
  }, [deliveryMethod, paymentMethodGroups, selectedPaymentMethod]);

  useEffect(() => {
    setExpandedPaymentGroups(
      paymentMethodGroups.reduce<Record<string, boolean>>((accumulator, group) => {
        accumulator[group.id] = false;
        return accumulator;
      }, {})
    );
  }, [paymentMethodGroups]);

  // Handle direct checkout
  useEffect(() => {
    const checkDirectCheckout = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isDirect = urlParams.get('direct') === 'true';
      
      
      if (isDirect) {
        const directItem = localStorage.getItem('directCheckoutItem');
        
        if (directItem) {
          try {
            const parsedItem = JSON.parse(directItem);
            setDirectCheckoutItem(parsedItem);
            setIsDirectCheckout(true);
          } catch {
            // Ignore parsing errors
          }
        }
      }
    };

    checkDirectCheckout();
  }, []);

  // Get selected courier service data for calculations
  const selectedCourierData = courierCompanies
    .find(company => company.id === selectedCourierCompany)
    ?.services.find(service => service.id === selectedCourierService);

  // Use direct checkout item or cart items
  const currentItems =
    isDirectCheckout && directCheckoutItem
      ? [directCheckoutItem]
      : cartItems.filter((item) => item.is_active !== false);
  
  
  
  // Calculate totals for direct checkout or cart
  const calculateTotals = () => {
    if (isDirectCheckout && directCheckoutItem) {
      const itemPrice = directCheckoutItem.price;
      const subtotal = itemPrice * directCheckoutItem.quantity;
      const discount = 0; // No discount for direct checkout
      const shippingCost = deliveryMethod === 'delivery' ? (selectedCourierData?.cost || 0) : 0;
      return {
        subtotal,
        discount,
        shipping: shippingCost,
        total: subtotal + shippingCost
      };
    } else {
      const subtotal = totalPrices.subtotal || 0;
      const discount = 0; // Simplified since we don't have discount calculation in new structure
      const shippingCost = deliveryMethod === 'delivery' ? (selectedCourierData?.cost || 0) : 0;
      return {
        subtotal,
        discount,
        shipping: shippingCost,
        total: totalPrices.total + shippingCost
      };
    }
  };

  const totals = calculateTotals();

  // Validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Only require address for delivery method
    if (deliveryMethod === 'delivery' && !selectedAddress) {
      newErrors.address = 'Alamat pengiriman harus dipilih';
    }
    
    // Only require courier for delivery method
    if (
      deliveryMethod === 'delivery' &&
      (!selectedCourierCompany || !selectedCourierService)
    ) {
      newErrors.courier = 'Ekspedisi dan layanan pengiriman harus dipilih';
    }
    
    if (currentItems.length === 0) {
      newErrors.cart = 'Keranjang kosong';
    }

    if (!selectedPaymentMethod) {
      newErrors.payment = 'Metode pembayaran harus dipilih';
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
      // Simulate API call - reduced time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create order data based on backend DTOs
      const orderData = {
        delivery_type: deliveryMethod,
        payment_method: selectedPaymentMethod as TransactionPaymentMethod,
        notes: additionalNotes || (deliveryMethod === 'pickup' ? 'Ambil di toko' : undefined),
        shipment_id: deliveryMethod === 'delivery' ? selectedCourierService : undefined,
        shipping_cost: deliveryMethod === 'delivery' ? (selectedCourierData?.cost || 0) : 0,
        shipment_address:
          deliveryMethod === 'delivery' && selectedAddress && selectedCourierData
            ? {
                recipientName: selectedAddress.name,
                phone: selectedAddress.phone,
                address: selectedAddress.address,
                city: selectedAddress.city,
                postalCode: selectedAddress.postal_code,
                courier: selectedCourierCompany.toUpperCase(),
                service: selectedCourierData.serviceType,
                estimatedDelivery: selectedCourierData.estimatedDelivery,
              }
            : undefined,
      };
      
      
      // Add transaction to context
      const newTransaction = addTransaction(orderData, currentItems);
      
      if (!newTransaction) {
        throw new Error('Failed to create transaction');
      }
      
      
      // Remove only active items from cart after successful payment
      if (!isDirectCheckout) {
        await removeActiveItems();
      } else {
        // Clear direct checkout item from localStorage
        localStorage.removeItem('directCheckoutItem');
      }
      
      // Show success message and navigate immediately
      toast.success(
        requiresPendingPayment(selectedPaymentMethod || undefined)
          ? 'Pesanan berhasil dibuat. Menunggu pembayaran.'
          : 'Pesanan berhasil dibuat!'
      );
      
      // Navigate after a short delay to ensure toast is visible
      setTimeout(() => {
        router.push('/order-confirmation');
      }, 500);
      
    } catch (error) {
      toast.error(`Terjadi kesalahan saat memproses pesanan: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const handleAddAddress = () => {
    setShowAddressSelector(true);
  };

  const handleAddressSelect = (address: AddressInfo) => {
    setSelectedAddress(address);
    setShowAddressSelector(false);
    clearError('address');
  };

  const handleAddNewAddress = () => {
    setShowAddressSelector(false);
    router.push('/shipment/create');
  };

  const togglePaymentGroup = (groupId: string) => {
    setExpandedPaymentGroups((previous) => ({
      ...previous,
      [groupId]: !previous[groupId],
    }));
  };

  const renderPaymentBadge = (badge: string, isAvailable: boolean) => (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-xl text-[10px] font-semibold ${
        isAvailable
          ? 'bg-[#F4F0E8] text-[#6B4E2E]'
          : 'bg-gray-100 text-gray-400'
      }`}
    >
      {badge}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same style as track order with white background */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex justify-center items-center relative mt-16 py-4">
          <div className="absolute left-10">
            <GoChevronLeft className="text-3xl cursor-pointer" onClick={handleBack} />
          </div>
          <div className="text-center">
            <h1 className="text-[16px] font-semibold">Checkout</h1>
            <p className="text-xs text-gray-500 mt-1">Lengkapi data pesanan Anda</p>
          </div>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {isDirectCheckout ? 'Produk yang Dibeli' : 'Produk Pesanan'}
          </h2>
          {currentItems.length === 0 ? (
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
              {currentItems.map((item: CartItemType) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                    <Image 
                      src={item.image || "/default-image.jpg"} 
                      alt={item.product_name} 
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{item.product_name}</h3>
                    <p className="text-xs text-gray-600">{item.variant_name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-medium text-gray-900">
                        {rupiahFormater(item.price)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {rupiahFormater(item.price * item.quantity)}
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
                Tambah Alamat
              </button>
            </div>
            
            {/* Store Address */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-800 font-medium mb-2">Alamat pengirim</p>
              <div className="flex items-start space-x-3">
                <GoLocation className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {storeAddress?.name || 'Alamat toko belum tersedia'}
                  </p>
                  <p className="text-sm text-gray-600">{storeAddress?.phone || '-'}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {storeAddress?.address || 'Alamat toko belum tersedia'}
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
                  <p className="text-sm">
                    {isReferenceLoading ? 'Memuat alamat...' : 'Pilih alamat pengiriman'}
                  </p>
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
                  <p className="font-medium text-gray-900">
                    {storeAddress?.name || 'Alamat toko belum tersedia'}
                  </p>
                  <p className="text-sm text-gray-600">{storeAddress?.phone || '-'}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {storeAddress?.address || 'Alamat toko belum tersedia'}
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
              isLoading={isLoading || isReferenceLoading || isCourierLoading}
            />
            {errors.courier && (
              <p className="text-red-500 text-xs mt-2">{errors.courier}</p>
            )}
          </div>
        )}

        {/* Additional Notes Section */}
        <div className="px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Catatan Tambahan</h2>
          <div className="space-y-3">
            <div>
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Pesan untuk penjual (opsional)
              </label>
              <textarea
                id="additionalNotes"
                value={additionalNotes}
                onChange={(e) => {
                  setAdditionalNotes(e.target.value);
                  clearError('notes');
                }}
                placeholder="Contoh: Ambil jam 3 sore, tolong bungkus rapi, dll."
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-colors"
                rows={3}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Maksimal 500 karakter
                </p>
                <span className="text-xs text-gray-400">
                  {additionalNotes.length}/500
                </span>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 font-medium mb-2">
                💡 Contoh catatan yang berguna:
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• &ldquo;Ambil jam 3 sore&rdquo;</li>
                <li>• &ldquo;Tolong bungkus rapi&rdquo;</li>
                <li>• &ldquo;Kirim ke alamat kantor&rdquo;</li>
                <li>• &ldquo;Hubungi sebelum kirim&rdquo;</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pembayaran</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal ({currentItems.length} item)</span>
              <span className="font-medium">{rupiahFormater(totals.subtotal)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Diskon</span>
                <span className="font-medium text-red-500">-{rupiahFormater(totals.discount)}</span>
              </div>
            )}
            {deliveryMethod === 'delivery' && totals.shipping > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ongkir</span>
                <span className="font-medium">{rupiahFormater(totals.shipping)}</span>
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
                <span className="text-primary">{rupiahFormater(totals.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Metode Pembayaran</h2>
          <div className="space-y-4">
            {paymentMethodGroups.map((group: PaymentMethodGroup) => (
              <div key={group.id} className="overflow-hidden rounded-2xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => togglePaymentGroup(group.id)}
                  className="flex w-full items-center justify-between bg-[#FAF7F2] px-4 py-3 text-left"
                >
                  <span className="text-base font-semibold text-[#0D0E09]">
                    {group.title}
                  </span>
                  <span className="text-lg text-gray-500">
                    {expandedPaymentGroups[group.id] ? '−' : '+'}
                  </span>
                </button>
                {expandedPaymentGroups[group.id] && (
                  <div className="divide-y divide-gray-100 bg-white">
                    {group.methods.map((method) => {
                      const isSelected = selectedPaymentMethod === method.id;

                      return (
                        <label
                          key={method.id}
                          className={`flex items-center gap-3 px-4 py-4 transition-all ${
                            method.isAvailable
                              ? 'cursor-pointer hover:bg-gray-50'
                              : 'cursor-not-allowed opacity-60'
                          } ${isSelected ? 'bg-primary/5' : ''}`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={isSelected}
                            disabled={!method.isAvailable}
                            onChange={(event) => {
                              setSelectedPaymentMethod(
                                event.target.value as TransactionPaymentMethod
                              );
                              clearError('payment');
                            }}
                            className="sr-only"
                          />
                          {renderPaymentBadge(method.badge, method.isAvailable)}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900">{method.name}</p>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                          <div
                            className={`h-6 w-6 rounded-full border-2 ${
                              isSelected
                                ? 'border-primary bg-primary'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isSelected && (
                              <IoCheckmarkCircle className="h-5 w-5 text-white" />
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
          {errors.payment && (
            <p className="text-red-500 text-xs mt-2">{errors.payment}</p>
          )}
        </div>

        {/* Payment Button */}
        <div className="px-4 py-6 bg-white sticky bottom-0">
          <button
            onClick={handlePayment}
            disabled={isLoading || currentItems.length === 0}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
              isLoading || currentItems.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90 active:scale-95'
            }`}
          >
            {isLoading ? (
              <ButtonSpinner size="md" color="white" text="Memproses..." />
            ) : (
              `${
                requiresPendingPayment(selectedPaymentMethod || undefined)
                  ? 'Buat Pesanan'
                  : 'Konfirmasi Pesanan'
              } ${rupiahFormater(totals.total)}`
            )}
          </button>
          
          {currentItems.length === 0 && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Keranjang kosong, tidak dapat melanjutkan pembayaran
            </p>
          )}
        </div>
      </div>

      {/* Address Selector Modal */}
      <AddressSelector
        addresses={addresses}
        selectedAddress={selectedAddress}
        onAddressSelect={handleAddressSelect}
        onAddNew={handleAddNewAddress}
        onClose={() => setShowAddressSelector(false)}
        isOpen={showAddressSelector}
      />
    </div>
  );
};

export default Order1Page;
