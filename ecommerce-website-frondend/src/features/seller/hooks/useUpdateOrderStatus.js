import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callUpdateOrderStatus } from "../../../services/OrderService";

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();
    const { mutate: updateOrderStatus, isLoading: isUpdating } = useMutation({
        mutationFn: ({ orderId, status }) => {
            console.log(status);
            callUpdateOrderStatus(orderId, status)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["orders"]);
            queryClient.invalidateQueries(["order-tools"]);
        },
    });

    return { updateOrderStatus, isUpdating };
}
