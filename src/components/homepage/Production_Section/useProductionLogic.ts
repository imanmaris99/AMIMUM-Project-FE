import { useState, useEffect } from "react";
import useBrandLoader from "@/hooks/useBrandLoader";
import getFilteredProductions from "@/utils/getFilteredProductions";
import { ProductionProps } from "@/components/homepage/Production_Section/types";
import { useBrandFilteredLoader } from "@/hooks/useBrandFilteredLoader";

const useProductionLogic = (selectedCategory: number | null) => {
    const [brandSkip, setBrandSkip] = useState(0);
    const [brandFilteredSkip, setBrandFilteredSkip] = useState(0);
    const brandLimit = 8;
    const brandFilteredLimit = 8;

    const {
        data: fetchedData,
        loading: isLoading,
        errorMessage,
        hasMore,
        remainingRecords,
    } = useBrandLoader(brandSkip, brandLimit);

    const [productions, setProductions] = useState<ProductionProps[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const { errorMessage: filteredErrorMessage, brandFilteredLoader } = useBrandFilteredLoader(selectedCategory ?? 0, brandFilteredSkip, brandFilteredLimit);

    useEffect(() => {
        setProductions([]);
    }, []);

    useEffect(() => {
        if (fetchedData.length > 0) {
            setProductions((prev) => [...prev, ...fetchedData]);
        }
    }, [fetchedData]);

    const loadMoreItems = () => {
        setIsLoadingMore(true);
        setBrandSkip((prevSkip) => prevSkip + brandLimit);
    };

    useEffect(() => {
        if (!isLoading && isLoadingMore) {
            setIsLoadingMore(false);
        }
    }, [isLoading, isLoadingMore]);

    const filteredProductions = selectedCategory === null
        ? productions
        : getFilteredProductions(
            brandFilteredLoader || { data: [], remaining_records: 0, has_more: false },
        );

    const showError = selectedCategory !== null && (filteredErrorMessage || errorMessage);
    const showLoading = selectedCategory !== null && (isLoading || (filteredProductions && filteredProductions.length === 0));

    return {
        productions,
        isLoading,
        errorMessage,
        hasMore,
        remainingRecords,
        isLoadingMore,
        loadMoreItems,
        filteredProductions,
        showError,
        showLoading,
        filteredErrorMessage,
    };
};

export default useProductionLogic; 