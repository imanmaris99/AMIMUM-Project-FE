import { TransactionPaymentMethod, TransactionStatus } from "@/types/transaction";

export interface PaymentMethodOption {
  id: TransactionPaymentMethod;
  name: string;
  description: string;
  badge: string;
  isAvailable: boolean;
}

export interface PaymentMethodGroup {
  id: string;
  title: string;
  methods: PaymentMethodOption[];
}

export const QRIS_MANUAL_IMAGE_PATH = "/payments/qris-toko-herbal-amimum.png";

const DELIVERY_PAYMENT_METHOD_GROUPS: PaymentMethodGroup[] = [
  {
    id: "qris_manual",
    title: "QRIS Resmi Toko",
    methods: [
      {
        id: "qris_manual",
        name: "QRIS Toko Herbal Amimum",
        description: "Scan QRIS resmi toko. Bisa pakai OVO, GoPay, DANA, ShopeePay, LinkAja, mobile banking, dan aplikasi QRIS lain.",
        badge: "QRIS",
        isAvailable: true,
      },
    ],
  },
  {
    id: "online_payment",
    title: "Midtrans Sandbox",
    methods: [
      {
        id: "qris",
        name: "Midtrans Sandbox (Testing)",
        description: "Mode uji coba: VA, QRIS, GoPay, atau kartu di halaman Midtrans sandbox",
        badge: "MT",
        isAvailable: true,
      },
    ],
  },
  {
    id: "offline",
    title: "Gerai Offline",
    methods: [
      {
        id: "alfamart",
        name: "Alfamart / Alfamidi / Lawson / Dan+Dan",
        description: "Bayar tunai di gerai terdekat",
        badge: "AL",
        isAvailable: true,
      },
      {
        id: "indomaret",
        name: "Indomaret / Ceriamart",
        description: "Bayar tunai di gerai terdekat",
        badge: "IN",
        isAvailable: true,
      },
    ],
  },
  {
    id: "cod",
    title: "Bayar di Tempat",
    methods: [
      {
        id: "cod",
        name: "COD",
        description: "Pesanan langsung diproses",
        badge: "COD",
        isAvailable: true,
      },
    ],
  },
];

const PICKUP_PAYMENT_METHOD_GROUPS: PaymentMethodGroup[] = [
  {
    id: "qris_manual",
    title: "QRIS Resmi Toko",
    methods: [
      {
        id: "qris_manual",
        name: "QRIS Toko Herbal Amimum",
        description: "Scan QRIS resmi toko. Bisa pakai OVO, GoPay, DANA, ShopeePay, LinkAja, mobile banking, dan aplikasi QRIS lain.",
        badge: "QRIS",
        isAvailable: true,
      },
    ],
  },
  {
    id: "online_payment",
    title: "Midtrans Sandbox",
    methods: [
      {
        id: "qris",
        name: "Midtrans Sandbox (Testing)",
        description: "Mode uji coba: VA, QRIS, GoPay, atau kartu di halaman Midtrans sandbox",
        badge: "MT",
        isAvailable: true,
      },
    ],
  },
  {
    id: "pickup",
    title: "Pembayaran Pickup",
    methods: [
      {
        id: "pay_at_store",
        name: "Bayar di Toko",
        description: "Bayar saat datang ke toko",
        badge: "TOKO",
        isAvailable: true,
      },
    ],
  },
];

export const getPaymentMethodGroups = (
  deliveryType: "delivery" | "pickup"
): PaymentMethodGroup[] =>
  deliveryType === "delivery"
    ? DELIVERY_PAYMENT_METHOD_GROUPS
    : PICKUP_PAYMENT_METHOD_GROUPS;

export const getPaymentMethodLabel = (
  method?: TransactionPaymentMethod
): string => {
  const allMethods = [
    ...DELIVERY_PAYMENT_METHOD_GROUPS.flatMap((group) => group.methods),
    ...PICKUP_PAYMENT_METHOD_GROUPS.flatMap((group) => group.methods),
  ];

  return allMethods.find((item) => item.id === method)?.name || "Belum dipilih";
};

export const isManualQrisPaymentMethod = (
  method?: TransactionPaymentMethod
): boolean => method === "qris_manual";

export const isMidtransSandboxPaymentMethod = (
  method?: TransactionPaymentMethod
): boolean => method === "qris";

export const requiresPendingPayment = (
  method?: TransactionPaymentMethod
): boolean =>
  !!method &&
  !["cod", "pay_at_store"].includes(method);

export const getInitialTransactionStatus = (
  method: TransactionPaymentMethod
): TransactionStatus =>
  requiresPendingPayment(method) ? "pending" : "processing";
