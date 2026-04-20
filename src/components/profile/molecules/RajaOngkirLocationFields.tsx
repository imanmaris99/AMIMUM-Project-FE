"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  getRajaOngkirCities,
  getRajaOngkirProvinces,
  RajaOngkirCity,
  RajaOngkirProvince,
} from "@/services/api/rajaongkir";

interface RajaOngkirLocationValue {
  province: string;
  city: string;
  cityId?: string;
}

interface RajaOngkirLocationFieldsProps {
  value: RajaOngkirLocationValue;
  onChange: (field: "province" | "city" | "cityId", nextValue: string) => void;
}

const normalizeAreaName = (value: string) =>
  value
    .toUpperCase()
    .replace(/^KOTA\s+/g, "")
    .replace(/^KABUPATEN\s+/g, "")
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const RajaOngkirLocationFields: React.FC<RajaOngkirLocationFieldsProps> = ({
  value,
  onChange,
}) => {
  const [provinces, setProvinces] = useState<RajaOngkirProvince[]>([]);
  const [cities, setCities] = useState<RajaOngkirCity[]>([]);
  const [provinceQuery, setProvinceQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      setLoadError(null);

      try {
        const response = await getRajaOngkirProvinces();
        setProvinces(response);
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Gagal memuat data provinsi."
        );
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    void loadProvinces();
  }, []);

  useEffect(() => {
    if (!provinces.length || selectedProvinceId) {
      return;
    }

    if (!value.province) {
      return;
    }

    const matchedProvince = provinces.find(
      (province) =>
        normalizeAreaName(province.province) === normalizeAreaName(value.province)
    );

    if (matchedProvince) {
      setSelectedProvinceId(String(matchedProvince.province_id));
    }
  }, [provinces, selectedProvinceId, value.province]);

  useEffect(() => {
    const loadCities = async () => {
      if (!selectedProvinceId) {
        setCities([]);
        return;
      }

      setIsLoadingCities(true);
      setLoadError(null);

      try {
        const response = await getRajaOngkirCities(Number(selectedProvinceId));
        setCities(response);
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : "Gagal memuat data kota."
        );
      } finally {
        setIsLoadingCities(false);
      }
    };

    void loadCities();
  }, [selectedProvinceId]);

  useEffect(() => {
    if (!cities.length) {
      return;
    }

    if (value.cityId) {
      const matchedCity = cities.find(
        (city) => String(city.city_id) === value.cityId
      );

      if (matchedCity && normalizeAreaName(value.city) !== normalizeAreaName(matchedCity.city_name)) {
        onChange("city", matchedCity.city_name);
      }

      return;
    }

    if (!value.city) {
      return;
    }

    const matchedCity = cities.find(
      (city) => normalizeAreaName(city.city_name) === normalizeAreaName(value.city)
    );

    if (matchedCity) {
      onChange("city", matchedCity.city_name);
      onChange("cityId", String(matchedCity.city_id));
    }
  }, [cities, onChange, value.city, value.cityId]);

  const filteredProvinces = useMemo(() => {
    if (!provinceQuery.trim()) {
      return provinces;
    }

    return provinces.filter((province) =>
      normalizeAreaName(province.province).includes(
        normalizeAreaName(provinceQuery)
      )
    );
  }, [provinceQuery, provinces]);

  const filteredCities = useMemo(() => {
    if (!cityQuery.trim()) {
      return cities;
    }

    return cities.filter((city) =>
      normalizeAreaName(city.city_name).includes(normalizeAreaName(cityQuery))
    );
  }, [cities, cityQuery]);

  const handleProvinceSelect = (provinceId: string) => {
    setSelectedProvinceId(provinceId);
    setCityQuery("");

    const matchedProvince = provinces.find(
      (province) => String(province.province_id) === provinceId
    );

    onChange("province", matchedProvince?.province || "");
    onChange("city", "");
    onChange("cityId", "");
  };

  const handleCitySelect = (cityId: string) => {
    const matchedCity = cities.find((city) => String(city.city_id) === cityId);

    onChange("cityId", cityId);
    onChange("city", matchedCity?.city_name || "");
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-[#999999]">Provinsi</label>
        </div>
        <input
          type="text"
          value={provinceQuery}
          onChange={(e) => setProvinceQuery(e.target.value)}
          className="w-full text-sm text-[#0D0E09] bg-transparent border-none outline-none placeholder-[#999999]"
          placeholder="Cari provinsi"
        />
        <select
          value={selectedProvinceId}
          onChange={(e) => handleProvinceSelect(e.target.value)}
          className="w-full rounded-lg border border-[#F2F2F2] bg-white px-3 py-2 text-sm text-[#0D0E09] outline-none"
          disabled={isLoadingProvinces}
        >
          <option value="">
            {isLoadingProvinces ? "Memuat provinsi..." : "Pilih provinsi"}
          </option>
          {filteredProvinces.map((province) => (
            <option key={province.province_id} value={province.province_id}>
              {province.province}
            </option>
          ))}
        </select>
        <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-[#999999]">Kota/Kabupaten</label>
        </div>
        <input
          type="text"
          value={cityQuery}
          onChange={(e) => setCityQuery(e.target.value)}
          className="w-full text-sm text-[#0D0E09] bg-transparent border-none outline-none placeholder-[#999999] disabled:cursor-not-allowed disabled:text-[#999999]"
          placeholder="Cari kota/kabupaten"
          disabled={!selectedProvinceId}
        />
        <select
          value={value.cityId || ""}
          onChange={(e) => handleCitySelect(e.target.value)}
          className="w-full rounded-lg border border-[#F2F2F2] bg-white px-3 py-2 text-sm text-[#0D0E09] outline-none disabled:cursor-not-allowed disabled:bg-[#F8F8F8]"
          disabled={!selectedProvinceId || isLoadingCities}
        >
          <option value="">
            {!selectedProvinceId
              ? "Pilih provinsi terlebih dahulu"
              : isLoadingCities
                ? "Memuat kota..."
                : "Pilih kota/kabupaten"}
          </option>
          {filteredCities.map((city) => (
            <option key={city.city_id} value={city.city_id}>
              {city.city_name}
            </option>
          ))}
        </select>
        <div className="w-full h-[1.5px] bg-[#F2F2F2]"></div>
      </div>

      {loadError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-center">
          <p className="text-sm text-red-600">{loadError}</p>
        </div>
      )}
    </>
  );
};

export default RajaOngkirLocationFields;
