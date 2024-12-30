import { useState, useEffect } from "react";
import useBrandLoader from "@/hooks/useBrandLoader";
import getFilteredProductions from "@/utils/getFilteredProductions";
import { ProductionProps } from "@/components/homepage/Production_Section/types";
import { useBrandFilteredLoader } from "@/hooks/useBrandFilteredLoader";

const useProductionLogic = (selectedCategory: number | null) => {
    const [skip, setSkip] = useState(0);
    const limit = 8;

    const {
        data: fetchedData,
        loading: isLoading,
        errorMessage,
        hasMore,
        remainingRecords,
    } = useBrandLoader(skip, limit);

    const [productions, setProductions] = useState<ProductionProps[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const { brandFilteredLoader } = useBrandFilteredLoader(selectedCategory ?? 1, skip, limit);

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
        setSkip((prevSkip) => prevSkip + limit);
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

    return {
        productions,
        isLoading,
        errorMessage,
        hasMore,
        remainingRecords,
        isLoadingMore,
        loadMoreItems,
        filteredProductions,
    };
};

export default useProductionLogic; 