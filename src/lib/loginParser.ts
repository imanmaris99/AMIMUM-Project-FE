type LoginUserData = {
  firstname?: string;
  first_name?: string;
  lastname?: string;
  last_name?: string;
  name?: string;
  full_name?: string;
  email?: string;
  role?: string;
  user?: {
    firstname?: string;
    first_name?: string;
    lastname?: string;
    last_name?: string;
    name?: string;
    full_name?: string;
    email?: string;
    role?: string;
  };
};

type LoginResponseDataShape = LoginUserData & {
  data?: {
    firstname?: string;
    first_name?: string;
    lastname?: string;
    last_name?: string;
    name?: string;
    full_name?: string;
    email?: string;
    role?: string;
    user?: {
      firstname?: string;
      first_name?: string;
      lastname?: string;
      last_name?: string;
      name?: string;
      full_name?: string;
      email?: string;
      role?: string;
    };
  };
};

type JsonRecord = Record<string, unknown>;

export type ParsedLoginUser = {
  email: string;
  name: string;
  firstname: string;
  role: "user" | "admin";
};

export type ParsedLoginResult = {
  user: ParsedLoginUser;
};

export type UserProfileResponseShape = {
  status_code?: number;
  message?: string;
  data?: {
    firstname?: string;
    first_name?: string;
    lastname?: string;
    last_name?: string;
    email?: string;
    role?: string;
  };
};

const isJsonRecord = (value: unknown): value is JsonRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const findFirstStringByKeys = (
  value: unknown,
  keys: string[],
  depth = 0,
  maxDepth = 5
): string | undefined => {
  if (depth > maxDepth) {
    return undefined;
  }

  if (typeof value === "string") {
    return undefined;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findFirstStringByKeys(item, keys, depth + 1, maxDepth);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  if (!isJsonRecord(value)) {
    return undefined;
  }

  for (const key of keys) {
    const keyValue = value[key];
    if (typeof keyValue === "string" && keyValue.trim()) {
      return keyValue.trim();
    }
  }

  for (const nestedValue of Object.values(value)) {
    const found = findFirstStringByKeys(nestedValue, keys, depth + 1, maxDepth);
    if (found) {
      return found;
    }
  }

  return undefined;
};

const normalizeRole = (role?: string): "user" | "admin" => {
  return role?.toLowerCase() === "admin" ? "admin" : "user";
};

export const parseLoginResult = (response: unknown, fallbackEmail: string): ParsedLoginResult => {
  const responsePayload = isJsonRecord(response) ? response : {};
  const responseData = (isJsonRecord(responsePayload.data) ? responsePayload.data : {}) as LoginResponseDataShape;

  const profileData = responseData.user || responseData.data?.user || responseData;

  const rawFullName =
    findFirstStringByKeys(responsePayload, ["name", "full_name"]) ||
    profileData.name?.trim() ||
    profileData.full_name?.trim() ||
    "";
  const firstnameFromFullName = rawFullName ? rawFullName.split(" ")[0]?.trim() : "";
  const firstname =
    findFirstStringByKeys(responsePayload, ["firstname", "first_name"]) ||
    profileData.firstname?.trim() ||
    profileData.first_name?.trim() ||
    firstnameFromFullName;
  const lastname =
    findFirstStringByKeys(responsePayload, ["lastname", "last_name"]) ||
    profileData.lastname?.trim() ||
    profileData.last_name?.trim();
  const normalizedFullName = rawFullName || `${firstname ?? ""} ${lastname ?? ""}`.trim();
  const fallbackName = fallbackEmail.split("@")[0];

  const email = findFirstStringByKeys(responsePayload, ["email"]) || fallbackEmail;
  const role = normalizeRole(findFirstStringByKeys(responsePayload, ["role"]) || profileData.role);
  return {
    user: {
      email,
      name: normalizedFullName || fallbackName,
      firstname: firstname || fallbackName,
      role,
    },
  };
};
