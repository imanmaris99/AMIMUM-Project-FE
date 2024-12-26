import useSWR from 'swr';
import { GetBrandLoader } from '@/API/brand';

const useBrandLoader = (initialSkip = 0, initialLimit = 9) => {
    const { data, error, isLoading } = useSWR(['/brand/loader', initialSkip, initialLimit], () => GetBrandLoader(initialSkip, initialLimit));

    let errorMessage: string | null = null;

    if (error) {
        const status = error.response?.status;
        if (status === 404) {
            errorMessage = "Merek tidak ditemukan";
        } else {
            errorMessage = "Terjadi kesalahan yang tidak diketahui";
        }
    }
    return {
        data: data ? data.data : [],
        remainingRecords: data ? data.data.remaining_records : 0,
        hasMore: data ? data.data.has_more : false,
        loading: isLoading,
        errorMessage
    };
};

export default useBrandLoader; 