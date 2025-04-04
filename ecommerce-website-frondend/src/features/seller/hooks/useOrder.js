import { useQuery } from "@tanstack/react-query";
import { callGetOrderByShopId } from "../../../services/OrderService";

export function useOrder(shopId) {
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ["orders", shopId],
        queryFn: () => callGetOrderByShopId(shopId),
        enabled: !!shopId,
    });

    return { orders, isLoading, error };
}
