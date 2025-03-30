import { useQuery } from "@tanstack/react-query";
import { getCategoryByCategoryDetailId } from "../../../services/Category";

export function useCategory(categoryDetailId) {
    const { data: category, isLoading, error } = useQuery({
        queryKey: ["category", categoryDetailId],
        queryFn: () => getCategoryByCategoryDetailId(categoryDetailId),
        enabled: !!categoryDetailId,
    });

    return { category, isLoading, error };
}
