import useSWR from "swr";
import { fetchUserProfile } from "@/API/user-customers";
import { UserProfileProps } from "@/components/homepage/Header_Section/types";

export const useUserProfile = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const shouldFetch = token !== null;
  const { data, error } = useSWR<UserProfileProps>(shouldFetch ? "/user/profile" : null, fetchUserProfile, {
    errorRetryCount: 0,
  });

  let errorMessage = null;

  if (error) {
    if (error.response?.status === 404) {
      errorMessage = "Data tidak ditemukan.";
    } else {
      errorMessage = "Terjadi kesalahan yang tidak diketahui.";
    }
  }

  return {
    user: data || null,
    isLoading: !error && !data,
    isError: !!error,
    errorMessage,
  };
};
