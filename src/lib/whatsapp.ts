export const OFFICIAL_ADMIN_WHATSAPP_NUMBER = "6281298742102";

export const PROFILE_ADMIN_SUPPORT_MESSAGE =
  "Assalamu'alaikum Admin Toko Herbal Amimum, saya membutuhkan bantuan terkait akun saya. Mohon bantuannya.";

export const CREATIVE_CUSTOM_SUPPORT_MESSAGE =
  "Assalamu'alaikum Admin Amimum, saya ingin konsultasi custom produk Amimum Creative.";

export const buildAdminSupportMessage = (context: string): string => {
  const normalizedContext = context.trim().replace(/[.!?]+$/, "");
  const safeContext = normalizedContext || "layanan toko";
  return `Assalamu'alaikum Admin Toko Herbal Amimum, saya ingin bertanya terkait ${safeContext}. Mohon bantuannya.`;
};

export const buildOfficialAdminWhatsAppUrl = (message: string): string => {
  const normalizedMessage = message.trim();
  const baseUrl = `https://wa.me/${OFFICIAL_ADMIN_WHATSAPP_NUMBER}`;
  return normalizedMessage
    ? `${baseUrl}?text=${encodeURIComponent(normalizedMessage)}`
    : baseUrl;
};
