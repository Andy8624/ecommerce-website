import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callUpdateOrderByOrderId } from "../../../services/OrderService";

export function useUpdateOrder() {
    const queryClient = useQueryClient();

    const { mutate: updateOrder, isLoading: isUpdating } = useMutation({
        mutationKey: ["orders"],
        mutationFn: ({ orderId, orderUpdate }) => {
            // console.log(orderUpdate);
            callUpdateOrderByOrderId(orderId, orderUpdate)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["orders"]);
            queryClient.invalidateQueries(["order-tools"]);

        },
    });

    return { updateOrder, isUpdating };
}
