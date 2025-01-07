import { useMutation } from "@tanstack/react-query";
import { callGetOrderToolByOrderId } from "../../../services/OrderToolService";

export function useGetOrderToolByOrderId() {
    const { mutateAsync: getOrderToolByOrderId, isLoading, error } = useMutation({
        mutationKey: ["order-tools"],
        mutationFn: (orderId) => {
            if (orderId) {
                return callGetOrderToolByOrderId(orderId);
            }
        },
    });

    return { getOrderToolByOrderId, isLoading, error };
}
