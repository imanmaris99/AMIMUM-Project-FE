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

const MIDTRANS_ENV = (process.env.NEXT_PUBLIC_MIDTRANS_ENV || "sandbox").toLowerCase();
const IS_MIDTRANS_PRODUCTION = MIDTRANS_ENV === "production" || MIDTRANS_ENV === "prod";

export const MIDTRANS_PAYMENT_LABEL = IS_MIDTRANS_PRODUCTION
  ? "Midtrans"
  : "Midtrans Mode Uji Coba";

export const MIDTRANS_PAYMENT_METHOD_NAME = IS_MIDTRANS_PRODUCTION
  ? "Pembayaran Online Midtrans"
  : "Pembayaran Online Midtrans (Uji Coba)";

export const MIDTRANS_PAYMENT_DESCRIPTION = IS_MIDTRANS_PRODUCTION
  ? "Pembayaran lewat pihak ketiga Midtrans. Pilihan seperti VA, QRIS, GoPay, kartu, atau metode lain mengikuti halaman Midtrans."
  : "Mode uji coba pihak ketiga Midtrans: VA, QRIS, GoPay, kartu, atau metode lain mengikuti halaman Midtrans.";

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
    title: "Transfer BRI Pemilik Toko",
    methods: [
      {
        id: "transfer",
        name: "Transfer BRI a.n. IMAN MARIS",
        description: `Transfer ke rekening BRI pemilik toko: ${STORE_BANK_ACCOUNT_TEXT}. Simpan bukti dan kirim ke admin setelah transfer.`,
        badge: "BRI",
        isAvailable: true,
      },
    ],
  },
  {
    id: "online_payment",
    title: "Midtrans (Pihak Ketiga)",
    methods: [
      {
        id: "qris",
        name: MIDTRANS_PAYMENT_METHOD_NAME,
        description: MIDTRANS_PAYMENT_DESCRIPTION,
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
    title: "Transfer BRI Pemilik Toko",
    methods: [
      {
        id: "transfer",
        name: "Transfer BRI a.n. IMAN MARIS",
        description: `Transfer ke rekening BRI pemilik toko: ${STORE_BANK_ACCOUNT_TEXT}. Simpan bukti dan kirim ke admin setelah transfer.`,
        badge: "BRI",
        isAvailable: true,
      },
    ],
  },
  {
    id: "online_payment",
    title: "Midtrans (Pihak Ketiga)",
    methods: [
      {
        id: "qris",
        name: MIDTRANS_PAYMENT_METHOD_NAME,
        description: MIDTRANS_PAYMENT_DESCRIPTION,
        badge: "MT",
        isAvailable: true,
      },
    ],
  },
  {
    id: "pickup",
    title: "Bayar di Tempat Khusus Pickup",
    methods: [
      {
        id: "pay_at_store",
        name: "Bayar di Toko saat Pickup",
        description: "Khusus pesanan pickup/ambil di toko. Pembayaran dilakukan langsung di toko saat pesanan diambil.",
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
  if (method === "cod") return "Ongkir dibayar saat paket tiba";

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

export const isMidtransOnlinePaymentMethod = (
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
