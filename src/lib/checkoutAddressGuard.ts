export const hasValidRajaOngkirCityId = (cityId: unknown): boolean => {
  if (typeof cityId === "number") {
    return Number.isSafeInteger(cityId) && cityId > 0;
  }

  if (typeof cityId !== "string" || !/^\d+$/.test(cityId.trim())) {
    return false;
  }

  const normalizedCityId = Number(cityId.trim());
  return Number.isSafeInteger(normalizedCityId) && normalizedCityId > 0;
};

export const isCheckoutAddressSelectable = (
  address: { city_id?: unknown } | null | undefined,
): boolean => Boolean(address && hasValidRajaOngkirCityId(address.city_id));
