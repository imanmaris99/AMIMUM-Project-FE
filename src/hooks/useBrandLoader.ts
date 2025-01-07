import useSWR from 'swr';
import { GetBrandLoader } from '@/API/brand';

const useBrandLoader = (skip = 0, limit = 8) => {
  const {
    data: brandLoaderData,
    error,
    isLoading
  } = useSWR(['/brand/loader', skip, limit], () => GetBrandLoader(skip, limit), {
    errorRetryCount: 0,
  });

  let errorMessage: string | null = null;

  if (error) {
    const status = error.response?.status;
    if (status === 404) {
      errorMessage = 'Merek tidak ditemukan';
    } else {
      errorMessage = 'Terjadi kesalahan yang tidak diketahui';
    }
  }

  return {
    data: brandLoaderData?.data ?? [],
    remainingRecords: brandLoaderData?.remaining_records ?? 0,
    hasMore: brandLoaderData?.has_more ?? false,
    loading: isLoading,
    isError: !!error,
    errorMessage
  };
};

export default useBrandLoader;
