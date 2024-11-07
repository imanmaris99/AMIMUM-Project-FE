import { useState, useEffect } from "react";
import { getCategories } from "@/utils/api/tag-categories";
import { CategoryProps } from "@/types";

export const useFetchCategories = () => {
    const [categories, setCategories] = useState<CategoryProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                setError("Failed to fetch categories");
            } finally {
                setIsLoading(false);
            }
        }
        loadCategories();
    }, []);

    return { categories, isLoading, error };
};
