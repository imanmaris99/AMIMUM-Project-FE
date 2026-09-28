export const normalizeIndonesianWhatsAppNumber = (value: string) => {
  const raw = String(value || '').trim();
  if (!raw) return '';

  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith('62')) return `+${digits}`;
  if (digits.startsWith('0')) return `+62${digits.slice(1)}`;
  return `+62${digits}`;
};

export const isLikelyIndonesianWhatsAppNumber = (value: string) => {
  const normalized = normalizeIndonesianWhatsAppNumber(value);
  return /^\+628\d{8,12}$/.test(normalized);
};

export const WHATSAPP_PHONE_HINT =
  'Gunakan nomor aktif yang bisa dihubungi admin dan terdaftar WhatsApp. Contoh: 081234567890 atau +6281234567890.';

export const WHATSAPP_PHONE_ERROR =
  'Nomor WhatsApp harus aktif dan valid. Gunakan format 08... atau +628... agar admin bisa mengirim update pesanan.';
