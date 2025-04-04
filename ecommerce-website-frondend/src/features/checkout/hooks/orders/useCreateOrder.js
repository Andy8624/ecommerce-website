import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callCreateOrder } from "../../../../services/OrderService";

export function useCreateOrder() {
    const queryClient = useQueryClient();
    const { mutateAsync: createOrder, isPending: isCreating, error } = useMutation({
        mutationFn: (order) => callCreateOrder(order),
        onSuccess: (data) => {
            queryClient.invalidateQueries("orders");
            return data;
        },
        onError: (error) => {
            return error;
        }
    })

    return { createOrder, isCreating, error };
}