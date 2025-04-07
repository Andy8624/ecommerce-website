import { useQuery } from "@tanstack/react-query";
import { callGetOrdersByUserId } from "../../../../services/OrderService";

export function useGetOrderByUserId(userId) {
    const { isLoading, data: orders, error } = useQuery({
        queryKey: ["orders", userId],
        queryFn: async () => {
            if (!userId) {
                return []; // Return empty array instead of undefined
            }
            try {
                const response = await callGetOrdersByUserId(userId);
                return response || []; // Ensure we return an array even if response is undefined
            } catch (error) {
                console.error("Error fetching orders:", error);
                return []; // Return empty array on error
            }
        },
        enabled: !!userId,
    });
    return { isLoading, orders, error };
}