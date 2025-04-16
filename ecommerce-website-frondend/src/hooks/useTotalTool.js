
import { useQuery } from "@tanstack/react-query";
import { callCountSoldToolByUserId, callCountToolByUserId, callGetTotalRatedOfProductByShopId } from "../services/UserService";

export function useTotalTool(userId) {
    const { isLoading, data: totalTool, error } = useQuery({
        queryKey: ["totalTool", userId],
        queryFn: () => callCountToolByUserId(userId),
        enabled: !!userId,
    });

    return { isLoading, totalTool, error };
}

export function useTotalSoldTool(userId) {
    const { isLoading, data: totalSoldTool, error } = useQuery({
        queryKey: ["totalSoldTool", userId],
        queryFn: () => callCountSoldToolByUserId(userId),
        enabled: !!userId,
    });

    return { isLoading, totalSoldTool, error };
}

export function useGetTotalRatedOfProductByShopId(userId) {
    const { isLoading, data: totalRated, error } = useQuery({
        queryKey: ["totalRated", userId],
        queryFn: () => callGetTotalRatedOfProductByShopId(userId),
        enabled: !!userId,
    });

    return { isLoading, totalRated, error };
}