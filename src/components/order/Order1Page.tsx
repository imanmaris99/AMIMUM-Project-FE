"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoChevronLeft, GoLocation, GoPackage } from 'react-icons/go';
import { IoWarning } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { useCart } from '@/contexts/CartContext';
import { CartItemType } from '@/types/apiTypes';
import { useTransaction } from '@/contexts/TransactionContext';
import AddressSelector from './AddressSelector';
import OrderAdditionalNotesSection from './OrderAdditionalNotesSection';
import OrderAddressSection from './OrderAddressSection';
import OrderCourierSection from './OrderCourierSection';
import OrderItemsSection from './OrderItemsSection';
import OrderPaymentSummarySection from './OrderPaymentSummarySection';
import OrderSubmitSection from './OrderSubmitSection';
import PaymentMethodSection from './PaymentMethodSection';
import {
  buildCheckoutOrderData,
  calculateCheckoutTotals,
  CheckoutAddressInfo,
  normalizeAreaName,
  validateCheckoutForm,
} from './orderPageUtils';
import { CourierCompany } from '@/types/shipment';
import { TransactionPaymentMethod } from '@/types/transaction';
import {
  getPaymentMethodGroups,
  requiresPendingPayment,
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

interface StoreAddressInfo {
  name: string;
  phone: string;
  address: string;
  cityId?: number;
}

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
  
  const [addresses, setAddresses] = useState<CheckoutAddressInfo[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<CheckoutAddressInfo | null>(null);
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

        const shipmentAddresses: CheckoutAddressInfo[] = await Promise.all(
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
  const totals = calculateCheckoutTotals({
    isDirectCheckout,
    directCheckoutItem,
    totalPrices,
    deliveryMethod,
    selectedCourierCost: selectedCourierData?.cost,
  });

  // Validation
  const validateForm = () => {
    const newErrors = validateCheckoutForm({
      deliveryMethod,
      selectedAddress,
      selectedCourierCompany,
      selectedCourierService,
      itemCount: currentItems.length,
      selectedPaymentMethod,
    });

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
      const orderData = buildCheckoutOrderData({
        deliveryMethod,
        selectedPaymentMethod: selectedPaymentMethod as TransactionPaymentMethod,
        additionalNotes,
        selectedCourierCompany,
        selectedCourierService,
        selectedCourierData,
        selectedAddress,
      });
      
      
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

  const handleAddressSelect = (address: CheckoutAddressInfo) => {
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
        <OrderItemsSection
          items={currentItems}
          title={isDirectCheckout ? 'Produk yang Dibeli' : 'Produk Pesanan'}
          onStartShopping={() => router.push('/')}
        />

        <OrderAddressSection
          deliveryMethod={deliveryMethod}
          storeAddress={storeAddress}
          selectedAddress={selectedAddress}
          isReferenceLoading={isReferenceLoading}
          addressError={errors.address}
          onAddAddress={handleAddAddress}
          onChangeAddress={() => {
            handleAddAddress();
            clearError('address');
          }}
        />

        {deliveryMethod === 'delivery' && (
          <OrderCourierSection
            courierCompanies={courierCompanies}
            selectedCourierCompany={selectedCourierCompany}
            selectedCourierService={selectedCourierService}
            isLoading={isLoading || isReferenceLoading || isCourierLoading}
            courierError={errors.courier}
            onCompanySelect={(companyId) => {
              setSelectedCourierCompany(companyId);
              clearError('courier');
            }}
            onServiceSelect={(serviceId) => {
              setSelectedCourierService(serviceId);
              clearError('courier');
            }}
          />
        )}

        <OrderAdditionalNotesSection
          additionalNotes={additionalNotes}
          onNotesChange={(value) => {
            setAdditionalNotes(value);
            clearError('notes');
          }}
        />

        {/* Payment Summary */}
        <OrderPaymentSummarySection
          itemCount={currentItems.length}
          deliveryMethod={deliveryMethod}
          totals={totals}
        />

        {/* Payment Method */}
        <PaymentMethodSection
          paymentMethodGroups={paymentMethodGroups}
          expandedPaymentGroups={expandedPaymentGroups}
          selectedPaymentMethod={selectedPaymentMethod}
          paymentError={errors.payment}
          onToggleGroup={togglePaymentGroup}
          onSelectPaymentMethod={(method) => {
            setSelectedPaymentMethod(method);
            clearError('payment');
          }}
        />

        {/* Payment Button */}
        <OrderSubmitSection
          isLoading={isLoading}
          isDisabled={isLoading || currentItems.length === 0}
          totalAmount={totals.total}
          submitLabel={
            requiresPendingPayment(selectedPaymentMethod || undefined)
              ? 'Buat Pesanan'
              : 'Konfirmasi Pesanan'
          }
          onSubmit={handlePayment}
        />

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

