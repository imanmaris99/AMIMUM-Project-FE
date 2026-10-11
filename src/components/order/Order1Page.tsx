"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoChevronLeft, GoLocation, GoPackage, GoPlus } from 'react-icons/go';
import { IoCheckmarkCircle, IoWarning } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import rupiahFormater from '@/utils/rupiahFormater';
import ButtonSpinner from '@/components/ui/ButtonSpinner';
import { useCart } from '@/contexts/CartContext';
import { CartItemType } from '@/types/apiTypes';
import { useTransaction } from '@/contexts/TransactionContext';
import { checkoutOrder, directCheckoutOrder, getMyOrders } from '@/services/api/orders';
import { createPayment } from '@/services/api/payments';
import { CartApiItem, deleteCartProduct, extractVariantInfo, getMyCartProducts } from '@/services/api/cart';
import { createShipment, activateShipment, getMyShipments } from '@/services/api/shipment';
import CourierSelector from './CourierSelector';
import AddressSelector from './AddressSelector';
import { CourierCompany } from '@/types/shipment';
import { TransactionPaymentMethod, TransactionStatus } from '@/types/transaction';
import {
  getPaymentMethodGroups,
  requiresPendingPayment,
  isManualQrisPaymentMethod,
  isManualBankTransferPaymentMethod,
  isMidtransOnlinePaymentMethod,
  PaymentMethodGroup,
  STORE_BANK_ACCOUNT_TEXT,
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

const hasValidRajaOngkirCityId = (cityId?: number) =>
  Boolean(cityId && Number(cityId) > 0);

interface StoreAddressInfo {
  name: string;
  phone: string;
  address: string;
  cityId?: number;
}

type ShippingFeePaymentMode = 'prepaid' | 'cod_shipping';

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

const getCourierName = (courierId: string) =>
  SUPPORTED_COURIERS.find((courier) => courier.id === courierId)?.name ||
  courierId.toUpperCase();

const getCourierUnavailableNotice = () =>
  'Belum ada layanan ongkir untuk kombinasi alamat dan ekspedisi yang tersedia. Coba cek ulang kota tujuan, berat paket, atau pilih alamat lain.';

const Order1Page: React.FC<Order1PageProps> = ({ onBack }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    cartItems,
    isLoading: isCartLoading,
    isSyncing: isCartSyncing,
    refreshCart,
  } = useCart();
  const { addTransaction } = useTransaction();
  
  // State management
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<TransactionPaymentMethod | null>(null);
  // Courier state - using hierarchical selection
  const [selectedCourierCompany, setSelectedCourierCompany] = useState<string>('');
  const [selectedCourierService, setSelectedCourierService] = useState<string>('');
  const [shippingFeePaymentMode, setShippingFeePaymentMode] =
    useState<ShippingFeePaymentMode>('prepaid');
  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = React.useRef(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  
  const [addresses, setAddresses] = useState<AddressInfo[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressInfo | null>(null);
  const [storeAddress, setStoreAddress] = useState<StoreAddressInfo | null>(null);
  const [courierCompanies, setCourierCompanies] = useState<CourierCompany[]>([]);
  const [isReferenceLoading, setIsReferenceLoading] = useState(true);
  const [isCourierLoading, setIsCourierLoading] = useState(false);
  const [courierNotice, setCourierNotice] = useState('');
  const [expandedPaymentGroups, setExpandedPaymentGroups] = useState<
    Record<string, boolean>
  >({});
  const [isRecoveringCreatedOrder, setIsRecoveringCreatedOrder] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<CartItemType | null>(null);
  const isDirectCheckout = searchParams?.get('direct') === 'true';
  const fallbackCourierNoticeRef = React.useRef<string | null>(null);
  const fallbackCourierNoticeTextRef = React.useRef('');

  const paymentMethodGroups = getPaymentMethodGroups(deliveryMethod);

  useEffect(() => {
    const loadReferences = async () => {
      setIsReferenceLoading(true);

      try {
        const [addressResult, ownerResult] = await Promise.allSettled([
          getMyShipmentAddresses(),
          getOwnerShipmentAddress(),
        ]);

        if (addressResult.status === 'fulfilled') {
          const shipmentAddresses: AddressInfo[] = await Promise.all(
            addressResult.value.data.map(async (address) => ({
              id: address.id.toString(),
              name: address.name,
              phone: address.phone,
              address: address.address || '',
              city: address.city || '',
              state: address.state || '',
              city_id: hasValidRajaOngkirCityId(address.city_id)
                ? address.city_id
                : undefined,
              postal_code: address.zip_code?.toString() || '',
              isDefault: false,
            }))
          );

          setAddresses(shipmentAddresses);
          setSelectedAddress(
            shipmentAddresses.find((address) =>
              hasValidRajaOngkirCityId(address.city_id)
            ) || null
          );
        }

        if (ownerResult.status === 'fulfilled') {
          const owner = ownerResult.value.data;
          const ownerCityId = owner.city_id || (
            owner.state && owner.city
              ? await resolveCityIdFromRajaOngkir(owner.state, owner.city)
              : undefined
          );

          setStoreAddress({
            name: owner.name,
            phone: owner.phone,
            cityId: ownerCityId,
            address: [owner.address, owner.city, owner.state, owner.zip_code, owner.country]
              .filter(Boolean)
              .join(', '),
          });
        } else {
          throw ownerResult.reason instanceof Error
            ? ownerResult.reason
            : new Error('Alamat pemilik toko tidak ditemukan.');
        }
        setCourierCompanies(
          SUPPORTED_COURIERS.map((courier) => ({
            id: courier.id,
            name: courier.name,
            services: [],
          }))
        );
      } catch {
        toast.error('Data checkout belum bisa dimuat. Silakan coba lagi beberapa saat lagi.');
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
      const preservedFallbackNotice =
        fallbackCourierNoticeRef.current === selectedCourierCompany
          ? fallbackCourierNoticeTextRef.current
          : '';
      setCourierNotice(preservedFallbackNotice);

      try {
        const selectedCourier = selectedCourierCompany;
        const courierQueue = [
          selectedCourier,
          ...SUPPORTED_COURIERS
            .map((courier) => courier.id)
            .filter((courierId) => courierId !== selectedCourier),
        ];
        let successfulCourier = selectedCourier;
        let nextServices: CourierCompany['services'] = [];
        let lastError: unknown = null;

        for (const courier of courierQueue) {
          try {
            const response = await getRajaOngkirShippingCost({
              origin: storeAddress.cityId,
              destination: selectedAddress.city_id,
              weight: 1000,
              courier,
            });

            const services = response.details.map((detail) => ({
              id: `${courier}-${detail.service}`,
              serviceType: detail.service,
              cost: detail.cost,
              estimatedDelivery: detail.etd,
              description: detail.description,
              weight: 1000,
            }));

            if (services.length > 0) {
              successfulCourier = courier;
              nextServices = services;
              break;
            }
          } catch (error) {
            lastError = error;
          }
        }

        setCourierCompanies((prevCompanies) =>
          prevCompanies.map((company) =>
            company.id === successfulCourier
              ? {
                  ...company,
                  services: nextServices,
                }
              : company.id === selectedCourier
                ? {
                    ...company,
                    services: [],
                  }
                : company
          )
        );

        if (nextServices.length === 0) {
          const notice = getCourierUnavailableNotice();
          setCourierNotice(notice);
          toast.error(
            lastError instanceof Error ? notice : 'Layanan ongkir belum tersedia.'
          );
          return;
        }

        const firstService = nextServices[0];

        if (successfulCourier !== selectedCourier) {
          const notice = `${getCourierName(selectedCourier)} belum tersedia untuk rute ini. Sistem memilih ${getCourierName(successfulCourier)} yang tersedia.`;
          fallbackCourierNoticeRef.current = successfulCourier;
          fallbackCourierNoticeTextRef.current = notice;
          setSelectedCourierCompany(successfulCourier);
          setSelectedCourierService(firstService.id);
          setCourierNotice(notice);
          toast.success(notice);
          return;
        }

        fallbackCourierNoticeRef.current = null;
        fallbackCourierNoticeTextRef.current = '';
        setSelectedCourierService((currentService) =>
          nextServices.some((service) => service.id === currentService)
            ? currentService
            : firstService.id
        );
      } catch {
        const notice = getCourierUnavailableNotice();
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
        setCourierNotice(notice);
        toast.error(notice);
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
    if (deliveryMethod !== 'delivery') {
      setShippingFeePaymentMode('prepaid');
    }
  }, [deliveryMethod]);

  useEffect(() => {
    setExpandedPaymentGroups(
      paymentMethodGroups.reduce<Record<string, boolean>>((accumulator, group) => {
        accumulator[group.id] = group.id === 'online_payment';
        return accumulator;
      }, {})
    );
  }, [paymentMethodGroups]);

  // Direct buy uses a temporary browser payload and never writes to cart_products.
  useEffect(() => {
    if (!isDirectCheckout) {
      setDirectCheckoutItem(null);
      return;
    }

    try {
      const rawItem = localStorage.getItem('directCheckoutItem');
      const parsedItem = rawItem ? JSON.parse(rawItem) as CartItemType : null;

      if (!parsedItem?.product_id || !parsedItem?.variant_id || !parsedItem?.price) {
        localStorage.removeItem('directCheckoutItem');
        toast.error('Data beli langsung belum ditemukan. Silakan pilih produk lagi.');
        router.replace('/cart');
        return;
      }

      setDirectCheckoutItem({
        ...parsedItem,
        quantity: Math.max(1, Number(parsedItem.quantity || 1)),
        is_active: true,
      });
      setErrors((previousErrors) => {
        if (!previousErrors.cart) {
          return previousErrors;
        }

        const remainingErrors = { ...previousErrors };
        delete remainingErrors.cart;
        return remainingErrors;
      });
    } catch {
      localStorage.removeItem('directCheckoutItem');
      toast.error('Data beli langsung belum bisa dibaca. Silakan pilih produk lagi.');
      router.replace('/cart');
    }
  }, [isDirectCheckout, router]);

  // Get selected courier service data for calculations
  const selectedCourierData = courierCompanies
    .find(company => company.id === selectedCourierCompany)
    ?.services.find(service => service.id === selectedCourierService);

  const hasValidDeliverySelection =
    deliveryMethod !== 'delivery' ||
    Boolean(
      hasValidRajaOngkirCityId(selectedAddress?.city_id) &&
        storeAddress?.cityId &&
        selectedCourierCompany &&
        selectedCourierService &&
        selectedCourierData &&
        selectedCourierData.cost > 0
    );

  const currentItems = isDirectCheckout && directCheckoutItem
    ? [directCheckoutItem]
    : cartItems.filter((item) => item.is_active !== false);
  const activeSubtotal = currentItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const buildCheckoutCartItems = async () => {
    if (isDirectCheckout && directCheckoutItem) {
      const subtotal = directCheckoutItem.price * directCheckoutItem.quantity;
      return {
        items: [directCheckoutItem] as CartItemType[],
        subtotal,
        total: subtotal,
      };
    }

    const freshCart = await getMyCartProducts();
    const freshActiveItems = freshCart.data.filter((item: CartApiItem) => item.is_active !== false);

    if (freshActiveItems.length === 0) {
      return {
        items: [] as CartItemType[],
        subtotal: 0,
        total: 0,
      };
    }

    const activeItemsById = new Map(currentItems.map((item) => [item.id, item]));

    return {
      items: freshActiveItems.map((item: CartApiItem) => {
        const existingItem = activeItemsById.get(item.id.toString());
        if (existingItem) {
          return existingItem;
        }

        const variantInfo = extractVariantInfo(item.variant_info);
        return {
          id: item.id.toString(),
          product_id: '',
          variant_id: typeof variantInfo.id === 'number' ? variantInfo.id : 0,
          quantity: item.quantity,
          price:
            typeof variantInfo.discounted_price === 'number'
              ? variantInfo.discounted_price
              : item.product_price,
          product_name: item.product_name,
          variant_name: variantInfo.variant || '',
          image: variantInfo.img || '/default-image.jpg',
          created_at: item.created_at,
          updated_at: variantInfo.updated_at || item.created_at,
          is_active: item.is_active,
        };
      }),
      subtotal: freshCart.total_prices.all_item_active_prices,
      total: freshCart.total_prices.total_all_active_prices,
    };
  };

  const recoverLatestPendingPayment = async (
    selectedPayment: TransactionPaymentMethod
  ) => {
    const ordersResponse = await getMyOrders();
    const now = Date.now();
    const recentPendingOnlineOrder = ordersResponse.data.find((order) => {
      const createdAt = new Date(order.created_at).getTime();
      const ageMinutes = Number.isFinite(createdAt)
        ? (now - createdAt) / 60000
        : Number.POSITIVE_INFINITY;
      const paymentToken = order.notes?.match(/\[PAYMENT:\s*([^\]]+)\]/i)?.[1]?.trim().toLowerCase();

      return (
        order.status?.toLowerCase() === 'pending' &&
        ageMinutes <= 30 &&
        paymentToken === selectedPayment
      );
    });

    if (!recentPendingOnlineOrder) {
      return false;
    }

    if (isManualQrisPaymentMethod(selectedPayment)) {
      toast.success('Pesanan QRIS ditemukan. Saya arahkan ke detail pembayaran QRIS.');
      router.push(`/transaction/${recentPendingOnlineOrder.id}`);
      return true;
    }

    try {
      const paymentResponse = await createPayment({
        order_id: recentPendingOnlineOrder.id,
      });

      if (paymentResponse.data.redirect_url) {
        toast.success('Pesanan ditemukan. Mengalihkan ke halaman pembayaran.');
        window.location.href = paymentResponse.data.redirect_url;
        return true;
      }
    } catch {
      toast.error('Pesanan sudah dibuat, tetapi halaman pembayaran belum terbuka. Saya arahkan ke detail transaksi untuk cek pembayaran.');
    }

    router.push(`/transaction/${recentPendingOnlineOrder.id}`);
    return true;
  };

  const canSubmitOrder =
    !isLoading &&
    !isRecoveringCreatedOrder &&
    (isDirectCheckout || !isCartLoading) &&
    (isDirectCheckout || !isCartSyncing) &&
    !isReferenceLoading &&
    !isCourierLoading &&
    currentItems.length > 0 &&
    activeSubtotal > 0 &&
    hasValidDeliverySelection &&
    Boolean(selectedPaymentMethod) &&
    whatsappConsent;
  
  
  
  // Calculate totals from active cart rows; buy-now also routes through cart first.
  const calculateTotals = () => {
    const subtotal = activeSubtotal;
    const discount = 0;
    const shippingCost = deliveryMethod === 'delivery' ? (selectedCourierData?.cost || 0) : 0;
    const payableShipping = shippingFeePaymentMode === 'prepaid' ? shippingCost : 0;

    return {
      subtotal,
      discount,
      shipping: shippingCost,
      payableShipping,
      shippingDueOnDelivery: shippingFeePaymentMode === 'cod_shipping' ? shippingCost : 0,
      total: subtotal + payableShipping,
    };
  };

  const totals = calculateTotals();
  const selectedPaymentOption = paymentMethodGroups
    .flatMap((group) => group.methods)
    .find((method) => method.id === selectedPaymentMethod);
  const checkoutReceiveSummary = deliveryMethod === 'pickup'
    ? 'Ambil langsung di toko. Pesanan pickup tidak memakai nomor resi.'
    : selectedCourierData
      ? `${getCourierName(selectedCourierCompany)} ${selectedCourierData.serviceType} — resi diinput admin setelah paket dikirim.`
      : 'Pilih alamat tujuan dan layanan kurir bila pesanan ingin dikirim.';
  const checkoutShippingSummary = deliveryMethod === 'pickup'
    ? 'Gratis ongkir karena pesanan diambil di toko.'
    : shippingFeePaymentMode === 'cod_shipping'
      ? 'Produk dibayar sekarang; ongkir dibayar saat paket tiba jika kurir mendukung.'
      : 'Produk dan ongkir digabung dalam total pembayaran.';
  const checkoutPaymentSummary = selectedPaymentOption
    ? selectedPaymentOption.name
    : 'Pilih QRIS resmi, Transfer BRI manual, atau pembayaran online yang tersedia.';
  const checkoutConfidenceItems = [
    {
      label: 'Produk',
      value: currentItems.length > 0
        ? `${currentItems.length} item siap checkout.`
        : 'Produk belum siap checkout.',
      isReady: currentItems.length > 0 && activeSubtotal > 0,
    },
    {
      label: 'Penerimaan',
      value: checkoutReceiveSummary,
      isReady: deliveryMethod === 'pickup' || hasValidDeliverySelection,
    },
    {
      label: 'Pembayaran resmi',
      value: checkoutPaymentSummary,
      isReady: Boolean(selectedPaymentMethod),
    },
    {
      label: 'Update pesanan',
      value: whatsappConsent
        ? 'Nomor WhatsApp aktif sudah dikonfirmasi.'
        : 'Centang persetujuan agar admin bisa follow-up manual bila perlu.',
      isReady: whatsappConsent,
    },
  ];

  const normalizeBackendOrderStatus = (status?: string): TransactionStatus => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return 'pending';
      case 'processing':
      case 'process':
        return 'processing';
      case 'shipped':
      case 'shipping':
        return 'shipped';
      case 'delivered':
        return 'delivered';
      case 'completed':
      case 'settlement':
      case 'paid':
        return 'completed';
      case 'cancelled':
      case 'canceled':
        return 'cancelled';
      case 'refund':
        return 'refund';
      default:
        return requiresPendingPayment(selectedPaymentMethod || undefined)
          ? 'pending'
          : 'processing';
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (deliveryMethod === 'delivery' && !selectedAddress) {
      newErrors.address = 'Alamat pengiriman harus dipilih';
    }

    if (
      deliveryMethod === 'delivery' &&
      selectedAddress &&
      !hasValidRajaOngkirCityId(selectedAddress.city_id)
    ) {
      newErrors.address = 'Kota alamat harus dipilih dari data RajaOngkir agar ongkir bisa dihitung';
    }

    if (deliveryMethod === 'delivery' && !storeAddress?.cityId) {
      newErrors.address = 'Alamat toko belum memiliki kota RajaOngkir yang valid';
    }
    
    if (
      deliveryMethod === 'delivery' &&
      (!selectedCourierCompany || !selectedCourierService)
    ) {
      newErrors.courier = 'Ekspedisi dan layanan pengiriman harus dipilih';
    }

    if (deliveryMethod === 'delivery' && selectedCourierService && !selectedCourierData) {
      newErrors.courier = 'Layanan pengiriman belum valid. Pilih ulang layanan ongkir';
    }

    if (deliveryMethod === 'delivery' && selectedCourierData && selectedCourierData.cost <= 0) {
      newErrors.courier = 'Biaya ongkir belum valid. Pilih layanan pengiriman lain';
    }
    
    if (currentItems.length === 0) {
      newErrors.cart = isDirectCheckout
        ? 'Produk Beli Langsung belum siap. Kembali ke produk lalu tekan Beli Langsung sekali lagi.'
        : 'Keranjang aktif kosong. Pilih minimal satu produk dari keranjang.';
    }

    if (currentItems.length > 0 && activeSubtotal <= 0) {
      newErrors.cart = 'Subtotal produk belum valid. Kembali ke keranjang dan pilih ulang produk.';
    }

    if (!selectedPaymentMethod) {
      newErrors.payment = 'Metode pembayaran harus dipilih';
    }

    if (!whatsappConsent) {
      newErrors.whatsappConsent = 'Setujui penggunaan nomor WhatsApp aktif untuk update pesanan.';
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
    if (isSubmittingRef.current) {
      toast.error('Pesanan sedang diproses. Mohon tunggu sebentar.');
      return;
    }

    if (!validateForm()) {
      toast.error('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    isSubmittingRef.current = true;
    setIsLoading(true);
    
    try {
      const selectedPayment = selectedPaymentMethod as TransactionPaymentMethod;
      const isPendingPaymentMethod = requiresPendingPayment(selectedPayment);
      const shouldOpenMidtrans = isMidtransOnlinePaymentMethod(selectedPayment);
      const freshCheckoutCart = await buildCheckoutCartItems();

      if (freshCheckoutCart.items.length === 0) {
        if (isPendingPaymentMethod && await recoverLatestPendingPayment(selectedPayment)) {
          return;
        }

        setErrors((previous) => ({
          ...previous,
          cart: 'Keranjang aktif tidak ditemukan. Silakan pilih produk dari keranjang dulu.',
        }));
        toast.error('Keranjang aktif tidak ditemukan. Saya arahkan kembali ke halaman transaksi jika pesanan sudah dibuat.');
        router.push('/transaction');
        return;
      }

      const checkoutSubtotal = freshCheckoutCart.subtotal;
      const checkoutShipping = deliveryMethod === 'delivery' ? (selectedCourierData?.cost || 0) : 0;
      const checkoutPayableShipping = shippingFeePaymentMode === 'prepaid' ? checkoutShipping : 0;
      const checkoutShippingDueOnDelivery = shippingFeePaymentMode === 'cod_shipping' ? checkoutShipping : 0;
      const checkoutTotal = freshCheckoutCart.total + checkoutPayableShipping;
      const shippingFeeNote = deliveryMethod === 'delivery'
        ? `[SHIPPING_FEE_PAYMENT: ${shippingFeePaymentMode}]`
        : undefined;
      const backendCheckoutNotes = [
        `[PAYMENT: ${selectedPayment}]`,
        shippingFeeNote,
        checkoutShippingDueOnDelivery > 0
          ? `[SHIPPING_DUE_ON_DELIVERY: ${Math.round(checkoutShippingDueOnDelivery)}]`
          : undefined,
        additionalNotes || (deliveryMethod === 'pickup' ? 'Ambil di toko' : undefined),
      ]
        .filter(Boolean)
        .join(' | ');

      // Create order data for local confirmation state.
      const orderData = {
        delivery_type: deliveryMethod,
        payment_method: selectedPayment,
        notes: backendCheckoutNotes,
        shipment_id: deliveryMethod === 'delivery' ? selectedCourierService : undefined,
        shipping_cost: checkoutShipping,
        shipping_fee_payment_mode: deliveryMethod === 'delivery' ? shippingFeePaymentMode : 'prepaid',
        shipping_due_on_delivery: checkoutShippingDueOnDelivery,
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

      if (deliveryMethod === 'delivery') {
        if (!selectedAddress?.city_id || !selectedCourierData) {
          throw new Error('Alamat dan layanan kurir belum lengkap.');
        }

        const shipmentResponse = await createShipment({
          address: {
            name: selectedAddress.name,
            phone: selectedAddress.phone,
            address: selectedAddress.address,
            city: selectedAddress.city,
            city_id: selectedAddress.city_id,
            state: selectedAddress.state || '',
            country: 'Indonesia',
            zip_code: Number(selectedAddress.postal_code || 0),
          },
          courier: {
            courier_name: selectedCourierCompany as 'jne' | 'pos' | 'tiki' | 'jnt',
            weight: selectedCourierData.weight || 1000,
            length: 1,
            width: 1,
            height: 1,
            service_type: selectedCourierData.serviceType,
            cost: selectedCourierData.cost,
            estimated_delivery: selectedCourierData.estimatedDelivery,
          },
        });

        if (shipmentResponse.data?.shipment_id) {
          await activateShipment(shipmentResponse.data.shipment_id, true);
        }
      } else {
        const shipmentResponse = await getMyShipments();
        const activeShipments = shipmentResponse.data.filter((shipment) => shipment.is_active);
        await Promise.all(
          activeShipments.map((shipment) => activateShipment(shipment.id, false))
        );
      }

      const checkoutResponse = isDirectCheckout && directCheckoutItem
        ? await directCheckoutOrder({
            product_id: directCheckoutItem.product_id,
            variant_id: directCheckoutItem.variant_id,
            quantity: directCheckoutItem.quantity,
            notes: backendCheckoutNotes,
            payment_method: selectedPayment,
            subtotal: checkoutSubtotal,
            discount_total: totals.discount,
            final_total: checkoutTotal,
          })
        : await checkoutOrder({
            notes: backendCheckoutNotes,
            payment_method: selectedPayment,
            subtotal: checkoutSubtotal,
            discount_total: totals.discount,
            final_total: checkoutTotal,
          });

      const backendOrder = checkoutResponse.data;

      if (isDirectCheckout) {
        localStorage.removeItem('directCheckoutItem');
        setDirectCheckoutItem(null);
      } else {
        try {
          const cartIdsToDelete = Array.from(
            new Set(
              freshCheckoutCart.items
                .map((item) => item.id?.toString())
                .filter((id): id is string => Boolean(id) && !id.startsWith('pending-'))
            )
          );

          await Promise.all(cartIdsToDelete.map((cartId) => deleteCartProduct(cartId)));
          await refreshCart();
        } catch (cartCleanupError) {
          console.warn('Failed to clean checked-out cart items', cartCleanupError);
          await refreshCart();
        }
      }

      const newTransaction = addTransaction(
        {
          ...orderData,
          shipment_id: backendOrder.shipment_id || orderData.shipment_id,
          backend_order_id: backendOrder.id,
          backend_order_status: normalizeBackendOrderStatus(backendOrder.status),
          backend_created_at: backendOrder.created_at,
        },
        freshCheckoutCart.items
      );

      if (!newTransaction) {
        throw new Error('Gagal menyimpan data transaksi. Silakan cek riwayat pesanan.');
      }

      if (shouldOpenMidtrans) {
        try {
          const paymentResponse = await createPayment({ order_id: backendOrder.id });
          if (paymentResponse.data.redirect_url) {
            toast.success('Pesanan dibuat. Mengalihkan ke halaman pembayaran.');
            window.location.href = paymentResponse.data.redirect_url;
            return;
          }
        } catch {
          toast.error('Pesanan sudah dibuat, tetapi halaman pembayaran belum terbuka. Buka detail transaksi untuk melanjutkan pembayaran.');
          router.push(`/transaction/${backendOrder.id}`);
          return;
        }
      }

      await refreshCart();
      toast.success(
        isPendingPaymentMethod
          ? 'Pesanan berhasil dibuat. Menunggu pembayaran.'
          : 'Pesanan berhasil dibuat!'
      );

      setTimeout(() => {
        if (isManualQrisPaymentMethod(selectedPayment)) {
          router.push(`/transaction/${backendOrder.id}`);
          return;
        }

        router.push(`/order-confirmation?transactionId=${backendOrder.id}`);
      }, 500);
      
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : '';
      const isActiveCartError = rawMessage.includes('Active cart items') || rawMessage.includes('Keranjang aktif tidak ditemukan');
      const customerMessage = isActiveCartError
        ? 'Keranjang aktif tidak ditemukan. Jika pesanan baru saja dibuat, saya coba arahkan ke pembayaran atau detail transaksi.'
        : 'Checkout belum bisa diproses. Silakan cek produk, alamat, ongkir, dan metode bayar lalu coba lagi.';
      toast.error(customerMessage);
      if (isActiveCartError) {
        setIsRecoveringCreatedOrder(true);
        const selectedPayment = selectedPaymentMethod as TransactionPaymentMethod | null;
        if (
          selectedPayment &&
          requiresPendingPayment(selectedPayment) &&
          await recoverLatestPendingPayment(selectedPayment)
        ) {
          return;
        }

        router.push('/transaction');
      }
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  const handleAddAddress = () => {
    setShowAddressSelector(true);
  };

  const handleAddressSelect = (address: AddressInfo) => {
    if (!hasValidRajaOngkirCityId(address.city_id)) {
      toast.error('Alamat ini belum punya kota RajaOngkir. Update alamat dulu sebelum checkout.');
      setErrors((prev) => ({
        ...prev,
        address: 'Alamat ini belum punya kota RajaOngkir. Update alamat dulu sebelum checkout.',
      }));
      return;
    }

    setSelectedAddress(address);
    setSelectedCourierCompany('');
    setSelectedCourierService('');
    setCourierNotice('');
    setShowAddressSelector(false);
    clearError('address');
    clearError('courier');
  };

  const handleAddNewAddress = () => {
    setShowAddressSelector(false);
    router.push('/shipment/create?returnTo=/order-1');
  };

  const togglePaymentGroup = (groupId: string) => {
    setExpandedPaymentGroups((previous) => ({
      ...previous,
      [groupId]: !previous[groupId],
    }));
  };

  const getCheckoutReadinessMessage = () => {
    if (!isDirectCheckout && isCartLoading) {
      return 'Memuat produk checkout dari keranjang...';
    }

    if (!isDirectCheckout && isCartSyncing) {
      return 'Menyimpan pilihan keranjang ke server sebelum checkout dibuka.';
    }

    if (isRecoveringCreatedOrder) {
      return 'Mengarahkan ke transaksi yang baru dibuat. Mohon tunggu sebentar.';
    }

    if (isReferenceLoading) {
      return 'Memuat data alamat dan opsi checkout...';
    }

    if (isCourierLoading) {
      return 'Memuat layanan ongkir. Mohon tunggu sebentar.';
    }

    if (isDirectCheckout && !directCheckoutItem) {
      return 'Memuat produk Beli Langsung...';
    }

    if (currentItems.length === 0) {
      return 'Keranjang aktif kosong. Pilih minimal satu produk dari keranjang.';
    }

    if (activeSubtotal <= 0) {
      return 'Subtotal produk belum valid. Kembali ke keranjang dan pilih ulang produk.';
    }

    if (deliveryMethod === 'delivery' && !selectedAddress) {
      return 'Pilih alamat tujuan yang valid dari RajaOngkir terlebih dahulu.';
    }

    if (
      deliveryMethod === 'delivery' &&
      selectedAddress &&
      !hasValidRajaOngkirCityId(selectedAddress.city_id)
    ) {
      return 'Alamat tujuan belum memiliki kota RajaOngkir. Update alamat dulu sebelum checkout.';
    }

    if (deliveryMethod === 'delivery' && !storeAddress?.cityId) {
      return 'Alamat toko belum memiliki kota RajaOngkir valid. Checkout delivery belum bisa dilanjutkan.';
    }

    if (deliveryMethod === 'delivery' && (!selectedCourierCompany || !selectedCourierService)) {
      return 'Pilih ekspedisi dan layanan ongkir terlebih dahulu.';
    }

    if (deliveryMethod === 'delivery' && (!selectedCourierData || selectedCourierData.cost <= 0)) {
      return 'Layanan ongkir belum valid. Pilih ulang layanan pengiriman.';
    }

    if (!selectedPaymentMethod) {
      return 'Pilih metode pembayaran terlebih dahulu.';
    }

    if (!whatsappConsent) {
      return 'Centang persetujuan WhatsApp agar admin bisa mengirim update pesanan ke nomor aktif Anda.';
    }

    if (isManualQrisPaymentMethod(selectedPaymentMethod)) {
      return 'Siap membuat pesanan QRIS. Setelah checkout, scan QRIS resmi toko dan admin akan mengonfirmasi pembayaran.';
    }

    return requiresPendingPayment(selectedPaymentMethod)
      ? 'Siap membuat pesanan. Setelah itu Anda akan diarahkan ke halaman pembayaran resmi Midtrans.'
      : 'Siap mengonfirmasi pesanan. Pesanan akan langsung masuk untuk diproses toko.';
  };

  const checkoutReadinessMessage = getCheckoutReadinessMessage();
  const isCheckoutCartLoading = !isDirectCheckout && (isCartLoading || isCartSyncing);
  const isCheckoutCartEmpty = !isDirectCheckout && !isCartLoading && !isLoading && !isReferenceLoading && currentItems.length === 0;

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
    <div className="min-h-screen bg-[linear-gradient(180deg,#F7FCF9_0%,#FFFFFF_44%,#FFFDF7_100%)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="relative flex items-center justify-center px-4 py-3">
          <div className="absolute left-4">
            <GoChevronLeft className="text-3xl cursor-pointer" onClick={handleBack} />
          </div>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Checkout resmi</p>
            <h1 className="mt-0.5 text-[16px] font-bold text-[#0D0E09]">Buat Pesanan</h1>
            <p className="mt-1 text-xs leading-snug text-[#6B7C73]">Pilih cara terima dan pembayaran</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-md bg-white/80 pb-2 shadow-sm shadow-gray-900/5">
        {/* Error Messages */}
        {Object.keys(errors).length > 0 && (
          <div className="mx-4 mt-4 rounded-3xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-2">
              <IoWarning className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              <div className="min-w-0">
                <p className="text-sm text-red-700 font-medium">Perhatian:</p>
                <ul className="mt-1 space-y-1 text-sm leading-relaxed text-red-600">
                  {Object.values(errors).map((error, index) => (
                    <li key={index} className="break-words">• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {isCheckoutCartLoading ? (
          <div className="px-4 py-8">
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 text-center shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
              <ButtonSpinner size="md" color="primary" text="Memuat produk checkout..." />
              <p className="mt-3 text-sm text-blue-800">
                Sistem sedang memastikan produk aktif dari keranjang sebelum checkout ditampilkan.
              </p>
            </div>
          </div>
        ) : isCheckoutCartEmpty ? (
          <div className="px-4 py-8">
            <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-5 text-center shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
              <GoPackage className="mx-auto mb-3 h-12 w-12 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Produk checkout belum siap
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                Belum ada produk aktif untuk diproses. Jika tadi menekan Beli Langsung,
                kembali ke produk lalu tekan Beli Langsung sekali lagi sampai muncul notifikasi
                produk siap checkout.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/cart')}
                  className="w-full rounded-2xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary/90"
                >
                  Cek Keranjang
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="w-full rounded-2xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary/5"
                >
                  Mulai Belanja
                </button>
              </div>
              <p className="mt-4 text-xs font-medium text-yellow-800">
                Checkout diamankan: alamat, ongkir, dan pembayaran tidak akan diproses sebelum produk aktif tersedia.
              </p>
            </div>
          </div>
        ) : (
          <>

        {/* Checkout Confidence Layer */}
        <div className="px-4 pt-4">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-emerald-900">Checkout Aman</p>
                <p className="mt-1 text-xs leading-relaxed text-emerald-800">
                  Cek produk, cara menerima pesanan, pembayaran resmi, dan kontak update sebelum membuat pesanan.
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${
                canSubmitOrder
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-emerald-700 ring-1 ring-emerald-200'
              }`}>
                {canSubmitOrder ? 'Siap checkout' : 'Lengkapi dulu'}
              </span>
            </div>
            <div className="mt-3 grid gap-2">
              {checkoutConfidenceItems.map((item) => (
                <div key={item.label} className="flex items-start gap-2 rounded-xl bg-white/80 px-3 py-2">
                  <IoCheckmarkCircle
                    className={`mt-0.5 h-4 w-4 shrink-0 ${item.isReady ? 'text-emerald-600' : 'text-gray-300'}`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#0D0E09]">{item.label}</p>
                    <p className="break-words text-[11px] leading-4 text-[#6B7C73]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Method Selection */}
        <div className="px-4 py-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Metode Penerimaan Pesanan</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              Pilih kirim ke alamat tujuan atau ambil langsung di toko. Alur ongkir dan resi hanya berlaku untuk pesanan yang dikirim.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className={`flex min-h-[92px] cursor-pointer items-center justify-center rounded-3xl border-2 p-4 transition-all ${
              deliveryMethod === 'delivery' 
                ? 'border-primary bg-primary/5' 
                : 'border-emerald-100 bg-white hover:border-primary/50'
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
                <GoPackage className="w-6 h-6 mx-auto mb-2 text-[#6B7C73]" />
                <span className="text-sm font-semibold text-[#0D0E09]">Kirim ke tujuan</span>
              </div>
            </label>
            <label className={`flex min-h-[92px] cursor-pointer items-center justify-center rounded-3xl border-2 p-4 transition-all ${
              deliveryMethod === 'pickup' 
                ? 'border-primary bg-primary/5' 
                : 'border-emerald-100 bg-white hover:border-primary/50'
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
                <GoLocation className="w-6 h-6 mx-auto mb-2 text-[#6B7C73]" />
                <span className="text-sm font-semibold text-[#0D0E09]">Ambil di toko</span>
              </div>
            </label>
          </div>
        </div>

        {/* Cart Items */}
        <div className="px-4 py-4">
          <div className="mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Item checkout</p>
            <h2 className="mt-1 text-lg font-bold text-[#0D0E09]">
              Produk Pesanan
            </h2>
          </div>
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
                <div key={item.id} className="flex items-start gap-3 rounded-3xl bg-white/95 p-3 shadow-[0_8px_22px_rgba(15,23,42,0.06)] ring-1 ring-emerald-50">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-emerald-50">
                    <Image
                      src={item.image || "/default-image.jpg"}
                      alt={item.product_name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                      unoptimized={false}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.src.endsWith('/default-image.jpg')) {
                          target.src = '/default-image.jpg';
                        }
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-sm font-semibold leading-snug text-[#0D0E09]">{item.product_name}</h3>
                    <p className="mt-1 break-words text-xs text-[#6B7C73]">{item.variant_name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-semibold text-[#0D0E09]">
                        {rupiahFormater(item.price)}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-[#6B7C73]">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-[#0D0E09]">
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
          <div className="px-4 py-4">
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
            <div className="mb-4 rounded-3xl bg-emerald-50/60 p-3">
              <p className="text-sm text-gray-800 font-medium mb-2">Alamat pengirim</p>
              <div className="flex items-start space-x-3">
                <GoLocation className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="break-words font-semibold text-[#0D0E09]">
                    {storeAddress?.name || 'Alamat toko belum tersedia'}
                  </p>
                  <p className="break-words text-sm text-[#6B7C73]">{storeAddress?.phone || '-'}</p>
                  <p className="mt-1 break-words text-sm text-[#6B7C73]">
                    {storeAddress?.address || 'Alamat toko belum tersedia'}
                  </p>
                  {!storeAddress?.cityId && (
                    <p className="mt-2 rounded-2xl bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-800">
                      Kota RajaOngkir alamat toko belum valid. Checkout delivery belum bisa dilanjutkan.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="rounded-3xl border-2 border-dashed border-emerald-100 bg-white/80 p-3">
              <p className="text-sm text-gray-800 font-medium mb-2">Alamat tujuan</p>
              {selectedAddress ? (
                <div className="flex items-start space-x-3">
                  <GoLocation className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="break-words font-semibold text-[#0D0E09]">{selectedAddress.name}</p>
                    <p className="break-words text-sm text-[#6B7C73]">{selectedAddress.phone}</p>
                    <p className="mt-1 break-words text-sm text-[#6B7C73]">
                      {selectedAddress.address}, {selectedAddress.city} {selectedAddress.postal_code}
                    </p>
                    {hasValidRajaOngkirCityId(selectedAddress.city_id) ? (
                      <p className="mt-2 inline-flex rounded-full bg-[#E6F2F0] px-3 py-1 text-xs font-semibold text-primary">
                        Alamat RajaOngkir valid untuk hitung ongkir.
                      </p>
                    ) : (
                      <p className="mt-2 rounded-2xl bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-800">
                        Alamat ini perlu update kota RajaOngkir sebelum checkout delivery.
                      </p>
                    )}
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
          <div className="px-4 py-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pengambilan</h2>
            <div className="rounded-3xl bg-blue-50 p-4">
              <div className="flex items-start space-x-3">
                  <GoLocation className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                  <p className="break-words font-semibold text-[#0D0E09]">
                    {storeAddress?.name || 'Alamat toko belum tersedia'}
                  </p>
                  <p className="break-words text-sm text-[#6B7C73]">{storeAddress?.phone || '-'}</p>
                  <p className="mt-1 break-words text-sm text-[#6B7C73]">
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
          <div className="px-4 py-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pilih Kurir</h2>
            <CourierSelector
              courierCompanies={courierCompanies}
              selectedCompany={selectedCourierCompany}
              selectedService={selectedCourierService}
              onCompanySelect={(companyId) => {
                setSelectedCourierCompany(companyId);
                setSelectedCourierService('');
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
            {courierNotice && (
              <p className="mt-2 rounded-2xl bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-800">
                {courierNotice}
              </p>
            )}
            {selectedCourierData && (
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900">Cara Bayar Biaya Kirim</h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">
                  Pilihan ini hanya untuk ongkir/jasa kirim. Pembayaran produk tetap melalui metode resmi toko.
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    {
                      id: 'prepaid' as ShippingFeePaymentMode,
                      title: 'Gabungkan ongkir dengan total produk',
                      description: 'Customer membayar produk + ongkir sekaligus melalui QRIS/Transfer/metode toko.',
                    },
                    {
                      id: 'cod_shipping' as ShippingFeePaymentMode,
                      title: 'Bayar ongkir saat paket tiba',
                      description: 'Customer membayar produk sekarang; biaya kirim dibayar saat paket tiba jika didukung kurir.',
                    },
                  ].map((option) => {
                    const isSelected = shippingFeePaymentMode === option.id;

                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shippingFeePaymentMode"
                          value={option.id}
                          checked={isSelected}
                          onChange={(event) => {
                            setShippingFeePaymentMode(event.target.value as ShippingFeePaymentMode);
                          }}
                          className="mt-1 h-4 w-4 accent-primary"
                        />
                        <span>
                          <span className="block text-sm font-semibold text-gray-900">{option.title}</span>
                          <span className="mt-1 block text-xs leading-relaxed text-gray-600">{option.description}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Additional Notes Section */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Catatan Tambahan</h2>
          <div className="space-y-3">
            <div>
              <label htmlFor="additionalNotes" className="block text-sm font-semibold text-[#0D0E09] mb-2">
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
                className="w-full resize-none rounded-2xl border border-emerald-100 px-3 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
            
            <div className="rounded-3xl border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm text-blue-800 font-medium mb-2">
                💡 Catatan berguna untuk toko:
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
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pembayaran</h2>
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <span className="text-[#6B7C73]">Subtotal ({currentItems.length} item)</span>
              <span className="font-medium">{rupiahFormater(totals.subtotal)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex items-start justify-between gap-4">
                <span className="text-[#6B7C73]">Diskon</span>
                <span className="font-medium text-red-500">-{rupiahFormater(totals.discount)}</span>
              </div>
            )}
            {deliveryMethod === 'delivery' && totals.shipping > 0 && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[#6B7C73]">
                    Ongkir {shippingFeePaymentMode === 'prepaid' ? '(digabung total)' : '(bayar saat paket tiba)'}
                  </span>
                  <span className="font-medium">{rupiahFormater(totals.shipping)}</span>
                </div>
                {totals.shippingDueOnDelivery > 0 && (
                  <div className="rounded-2xl bg-orange-50 px-3 py-2 text-xs font-medium text-orange-800">
                    Ongkir {rupiahFormater(totals.shippingDueOnDelivery)} tidak masuk total pembayaran produk; dibayar saat paket tiba sesuai kebijakan/dukungan kurir.
                  </div>
                )}
              </>
            )}
            {deliveryMethod === 'pickup' && (
              <div className="flex items-start justify-between gap-4">
                <span className="text-[#6B7C73]">Pengambilan</span>
                <span className="font-medium text-green-600">Gratis</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-start justify-between gap-4 text-lg font-semibold">
                <span>{shippingFeePaymentMode === 'cod_shipping' ? 'Total bayar produk sekarang' : 'Total'}</span>
                <span className="text-primary">{rupiahFormater(totals.total)}</span>
              </div>
              <p className="mt-2 rounded-xl bg-[#F7FCF9] px-3 py-2 text-xs leading-relaxed text-gray-600">
                {checkoutShippingSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Metode Pembayaran</h2>
          <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3 text-sm leading-relaxed text-blue-800">
            Pilih metode sesuai kebutuhan: QRIS resmi toko, transfer ke rekening BRI pemilik toko, atau pembayaran online melalui pihak ketiga Midtrans. Khusus pesanan pickup/ambil di toko, tersedia pilihan bayar langsung di toko saat pesanan diambil.
          </div>
          <div className="space-y-4">
            {paymentMethodGroups.map((group: PaymentMethodGroup) => (
              <div key={group.id} className="overflow-hidden rounded-3xl border border-emerald-100 bg-white/95">
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
                              ? 'cursor-pointer hover:bg-emerald-50/60'
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
                            <p className="break-words font-semibold text-[#0D0E09]">{method.name}</p>
                            <p className="break-words text-sm leading-relaxed text-[#6B7C73]">{method.description}</p>
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
          {selectedPaymentMethod && (isManualQrisPaymentMethod(selectedPaymentMethod) || isManualBankTransferPaymentMethod(selectedPaymentMethod)) && (
            <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
              <p className="font-semibold">Instruksi pembayaran manual</p>
              {isManualBankTransferPaymentMethod(selectedPaymentMethod) ? (
                <p className="mt-1 text-xs leading-relaxed">
                  Transfer ke rekening resmi toko: <strong>{STORE_BANK_ACCOUNT_TEXT}</strong>. Setelah transfer, simpan bukti dan kirim ke admin melalui WhatsApp agar pesanan segera diverifikasi.
                </p>
              ) : (
                <p className="mt-1 text-xs leading-relaxed">
                  Scan QRIS resmi toko setelah pesanan dibuat, bayar sesuai total, lalu simpan bukti pembayaran dan konfirmasi ke admin.
                </p>
              )}
            </div>
          )}
        </div>

        {/* WhatsApp Consent */}
        <div className="px-4 py-4">
          <label className="flex items-start gap-3 rounded-2xl border border-[#CFE7DD] bg-[#F4FBF7] p-4">
            <input
              type="checkbox"
              checked={whatsappConsent}
              onChange={(event) => {
                setWhatsappConsent(event.target.checked);
                clearError('whatsappConsent');
              }}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm leading-relaxed text-gray-700">
              <strong className="block text-gray-900">Nomor WhatsApp aktif untuk update pesanan</strong>
              Saya memastikan nomor pada alamat/pesanan ini aktif, bisa dihubungi, dan terdaftar WhatsApp. Toko Herbal Amimum boleh menghubungi saya melalui WhatsApp untuk konfirmasi pembayaran, packing, pengiriman, resi, dan update pesanan.
            </span>
          </label>
          {errors.whatsappConsent && (
            <p className="text-red-500 text-xs mt-2">{errors.whatsappConsent}</p>
          )}
        </div>

        {/* Payment Button */}
        <div className="sticky bottom-0 bg-white/95 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
          <button
            onClick={handlePayment}
            disabled={!canSubmitOrder}
            className={`w-full rounded-2xl py-4 text-base font-bold leading-tight transition-all ${
              !canSubmitOrder
                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                : 'bg-primary text-white hover:bg-primary/90 active:scale-95'
            }`}
          >
            {isRecoveringCreatedOrder ? (
              'Mengarahkan ke Transaksi...'
            ) : isLoading ? (
              <ButtonSpinner size="md" color="white" text="Memproses..." />
            ) : (
              `${
                requiresPendingPayment(selectedPaymentMethod || undefined)
                  ? 'Buat Pesanan & Lanjut Bayar'
                  : 'Konfirmasi Pesanan'
              } ${rupiahFormater(totals.total)}`
            )}
          </button>
          
          <p className={`mt-2 text-center text-xs leading-relaxed ${canSubmitOrder ? 'text-primary' : 'text-[#6B7C73]'}`}>
            {checkoutReadinessMessage}
          </p>
        </div>
          </>
        )}
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
