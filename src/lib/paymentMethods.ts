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

export const STORE_BANK_ACCOUNT = {
  bank: "BRI",
  number: "657401009669505",
  accountName: "IMAN MARIS",
};

export const STORE_BANK_ACCOUNT_TEXT = `${STORE_BANK_ACCOUNT.bank} ${STORE_BANK_ACCOUNT.number} a.n. ${STORE_BANK_ACCOUNT.accountName}`;

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
    id: "bank_transfer_manual",
    title: "Transfer Bank Manual",
    methods: [
      {
        id: "transfer",
        name: "Transfer BRI Manual",
        description: `Transfer ke rekening resmi toko: ${STORE_BANK_ACCOUNT_TEXT}. Kirim bukti pembayaran ke admin setelah transfer.`,
        badge: "BRI",
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
    id: "bank_transfer_manual",
    title: "Transfer Bank Manual",
    methods: [
      {
        id: "transfer",
        name: "Transfer BRI Manual",
        description: `Transfer ke rekening resmi toko: ${STORE_BANK_ACCOUNT_TEXT}. Kirim bukti pembayaran ke admin setelah transfer.`,
        badge: "BRI",
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
    title: "Bayar Langsung di Toko Amimum",
    methods: [
      {
        id: "pay_at_store",
        name: "Bayar di Toko Herbal Amimum",
        description: "Khusus pickup/ambil di toko. Pembayaran dilakukan langsung di toko offline Toko Herbal Amimum.",
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
  if (method === "cod") return "COD ongkir/jasa kirim";

  const allMethods = [
    ...DELIVERY_PAYMENT_METHOD_GROUPS.flatMap((group) => group.methods),
    ...PICKUP_PAYMENT_METHOD_GROUPS.flatMap((group) => group.methods),
  ];

  return allMethods.find((item) => item.id === method)?.name || "Belum dipilih";
};

export const isManualQrisPaymentMethod = (
  method?: TransactionPaymentMethod
): boolean => method === "qris_manual";

export const isManualBankTransferPaymentMethod = (
  method?: TransactionPaymentMethod
): boolean => method === "transfer";

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
