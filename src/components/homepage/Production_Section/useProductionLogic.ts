import { useState, useEffect } from "react";
import useBrandLoader from "@/hooks/useBrandLoader";
import { useGetAllProductions } from "@/hooks/useProductions";
import getFilteredProductions from "@/utils/getFilteredProductions";
import { ProductionProps } from "@/components/homepage/Production_Section/types";

const useProductionLogic = (selectedCategory: string | null) => {
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

    const { allProductions } = useGetAllProductions();

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

    const filteredProductions = getFilteredProductions(
        allProductions || [],
        selectedCategory
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