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

const DELIVERY_PAYMENT_METHOD_GROUPS: PaymentMethodGroup[] = [
  {
    id: "virtual_account",
    title: "Virtual Account",
    methods: [
      {
        id: "bca_va",
        name: "BCA Virtual Account",
        description: "Dicek otomatis setelah pembayaran berhasil",
        badge: "BCA",
        isAvailable: true,
      },
      {
        id: "mandiri_va",
        name: "Mandiri Virtual Account",
        description: "Dicek otomatis setelah pembayaran berhasil",
        badge: "MDR",
        isAvailable: true,
      },
      {
        id: "bni_va",
        name: "BNI Virtual Account",
        description: "Dicek otomatis setelah pembayaran berhasil",
        badge: "BNI",
        isAvailable: true,
      },
      {
        id: "bri_va",
        name: "BRI Virtual Account",
        description: "Dicek otomatis setelah pembayaran berhasil",
        badge: "BRI",
        isAvailable: true,
      },
      {
        id: "bsi_va",
        name: "BSI Virtual Account",
        description: "Dicek otomatis setelah pembayaran berhasil",
        badge: "BSI",
        isAvailable: true,
      },
      {
        id: "permata_va",
        name: "Permata Virtual Account",
        description: "Tersedia untuk transaksi ini",
        badge: "PMT",
        isAvailable: true,
      },
    ],
  },
  {
    id: "dompet_digital",
    title: "Dompet Digital",
    methods: [
      {
        id: "gopay",
        name: "GoPay",
        description: "Tersedia untuk transaksi ini",
        badge: "GP",
        isAvailable: true,
      },
      {
        id: "ovo",
        name: "OVO",
        description: "Dalam perbaikan",
        badge: "OV",
        isAvailable: false,
      },
      {
        id: "dana",
        name: "DANA",
        description: "Dalam perbaikan",
        badge: "DN",
        isAvailable: false,
      },
    ],
  },
  {
    id: "instan",
    title: "Pembayaran Instan",
    methods: [
      {
        id: "qris",
        name: "QRIS",
        description: "Status awal menunggu pembayaran",
        badge: "QR",
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
    id: "virtual_account",
    title: "Virtual Account",
    methods: DELIVERY_PAYMENT_METHOD_GROUPS[0].methods,
  },
  {
    id: "digital",
    title: "Dompet Digital",
    methods: [
      {
        id: "gopay",
        name: "GoPay",
        description: "Bayar online sebelum ambil di toko",
        badge: "GP",
        isAvailable: true,
      },
      {
        id: "qris",
        name: "QRIS",
        description: "Bayar online sebelum ambil di toko",
        badge: "QR",
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

export const requiresPendingPayment = (
  method?: TransactionPaymentMethod
): boolean =>
  !!method &&
  !["cod", "pay_at_store"].includes(method);

export const getInitialTransactionStatus = (
  method: TransactionPaymentMethod
): TransactionStatus =>
  requiresPendingPayment(method) ? "pending" : "processing";
