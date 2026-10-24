const BACKEND_SPECIAL_CHARACTER = /[!@#$%^&*(),.?":{}|<>]/;
const BACKEND_PHONE_FORMAT = /^\+62\d{10,11}$/;

export function buildLoginPayload(email: string, password: string) {
  return {
    email: email.trim().toLowerCase(),
    // Passwords are credentials, not display text: never escape or rewrite them.
    password,
  };
}

export function getRegistrationPasswordError(password: string): string | null {
  if (password.length < 8) return "Password minimal 8 karakter.";
  if (!/[A-Z]/.test(password)) return "Password harus mengandung huruf besar.";
  if (!/[a-z]/.test(password)) return "Password harus mengandung huruf kecil.";
  if (!/[0-9]/.test(password)) return "Password harus mengandung angka.";
  if (!BACKEND_SPECIAL_CHARACTER.test(password)) {
    return "Password harus mengandung karakter spesial.";
  }
  return null;
}

export function normalizeRegistrationPhoneNumber(value: string): string {
  const raw = String(value || "").trim();
  if (!raw || !/^[+\d\s().-]+$/.test(raw)) return "";

  const compact = raw.replace(/[\s().-]/g, "");
  if (!/^(?:\+62|62|0)\d+$/.test(compact)) return "";
  if (compact.startsWith("+62")) return compact;
  if (compact.startsWith("62")) return `+${compact}`;
  return `+62${compact.slice(1)}`;
}

export function isValidRegistrationPhone(value: string): boolean {
  return BACKEND_PHONE_FORMAT.test(value);
}

type BackendValidationIssue = {
  loc?: Array<string | number>;
  msg?: string;
};

type RegistrationErrorPayload = {
  detail?: unknown;
  message?: unknown;
};

function extractBackendMessage(payload: RegistrationErrorPayload): string {
  const detail = payload?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((issue) => (issue as BackendValidationIssue)?.msg ?? "")
      .filter(Boolean)
      .join(" ");
  }
  if (detail && typeof detail === "object" && "message" in detail) {
    const message = (detail as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return typeof payload?.message === "string" ? payload.message : "";
}

function hasFieldIssue(payload: RegistrationErrorPayload, field: string): boolean {
  if (!Array.isArray(payload?.detail)) return false;
  return payload.detail.some((issue) =>
    (issue as BackendValidationIssue)?.loc?.includes(field),
  );
}

export function getRegisterErrorMessage(status: number, payload: unknown): string {
  const errorPayload = (payload && typeof payload === "object"
    ? payload
    : {}) as RegistrationErrorPayload;
  const normalizedMessage = extractBackendMessage(errorPayload).toLowerCase();

  if (
    /password.*(at least|contain|must|should|required)|password must|password harus/.test(
      normalizedMessage,
    ) && !/wajib diisi/.test(normalizedMessage)
  ) {
    return "Password minimal 8 karakter dan wajib memuat huruf besar, huruf kecil, angka, serta karakter spesial.";
  }

  if (
    status === 409 ||
    /already exists|already in use|already registered|duplicate|sudah terdaftar/.test(
      normalizedMessage,
    ) ||
    (status === 400 && /email.*(exists|use)|phone.*(exists|use)/.test(normalizedMessage))
  ) {
    return "Email atau nomor HP sudah terdaftar.";
  }

  if (
    hasFieldIssue(errorPayload, "phone") ||
    /phone number must|phone.*invalid/.test(normalizedMessage)
  ) {
    return "Nomor HP gunakan format 08... atau +62... dengan jumlah digit yang benar.";
  }

  if (
    hasFieldIssue(errorPayload, "email") ||
    /email.*invalid|valid email/.test(normalizedMessage)
  ) {
    return "Format email tidak valid. Periksa kembali alamat email Anda.";
  }

  return "Registrasi belum bisa diproses. Silakan coba lagi nanti.";
}
