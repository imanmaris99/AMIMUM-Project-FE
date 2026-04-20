export const AUTH_FLOW_STORAGE_KEYS = {
  verifyEmail: "verifyEmail",
  resetEmail: "resetPasswordEmail",
  loginEmail: "loginEmail",
} as const;

type AuthFlowStorageKey =
  (typeof AUTH_FLOW_STORAGE_KEYS)[keyof typeof AUTH_FLOW_STORAGE_KEYS];

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const saveAuthFlowEmail = (key: AuthFlowStorageKey, email: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    sessionStorage.removeItem(key);
    return;
  }

  sessionStorage.setItem(key, normalizedEmail);
};

export const readAuthFlowEmail = (key: AuthFlowStorageKey) => {
  if (typeof window === "undefined") {
    return "";
  }

  return sessionStorage.getItem(key) ?? "";
};

export const takeAuthFlowEmail = (key: AuthFlowStorageKey) => {
  const email = readAuthFlowEmail(key);

  if (typeof window !== "undefined" && email) {
    sessionStorage.removeItem(key);
  }

  return email;
};

export const resolveAuthFlowEmail = (
  queryEmail: string | null,
  key: AuthFlowStorageKey
) => {
  const normalizedQueryEmail = queryEmail ? normalizeEmail(queryEmail) : "";
  if (normalizedQueryEmail) {
    saveAuthFlowEmail(key, normalizedQueryEmail);
    return normalizedQueryEmail;
  }

  return readAuthFlowEmail(key);
};
