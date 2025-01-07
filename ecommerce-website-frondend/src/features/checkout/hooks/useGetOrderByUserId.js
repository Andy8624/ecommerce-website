import { useQuery } from "@tanstack/react-query";
import { callGetOrdersByUserId } from "../../../services/OrderService";

export function useGetOrderByUserId(userId) {
    const { isLoading, data: orders, error } = useQuery({
        queryKey: ["orders"],
        queryFn: () => callGetOrdersByUserId(userId),
        enabled: !!userId,
    });
    return { isLoading, orders, error };
}