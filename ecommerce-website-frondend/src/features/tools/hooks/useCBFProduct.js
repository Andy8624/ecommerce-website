import { useQuery } from "@tanstack/react-query";
import { getSimilarProductList_CBF } from "../../../services/RecomendationService";

export function useCBFProduct(toolId, quantity) {
    const { isLoading, data: cbf_tools, error } = useQuery({
        queryKey: ["cbf_tools"],
        queryFn: () => getSimilarProductList_CBF(toolId, quantity),
        // staleTime: 5 * 60 * 1000, // 5 phút (giữ dữ liệu "tươi", không refetch)
        // cacheTime: 10 * 60 * 1000, // 10 phút (giữ cache sau khi unmount)
        // refetchOnWindowFocus: false, // Không tự động fetch lại khi chuyển tab
        enabled: !!toolId

    });

    return { isLoading, error, cbf_tools };
}
