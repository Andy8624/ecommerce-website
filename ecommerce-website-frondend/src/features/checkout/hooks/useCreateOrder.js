import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callCreateOrder } from "../../../services/OrderService";
import { toast } from "react-toastify";

export function useCreateOrder() {
    const queryClient = useQueryClient();
    const { mutateAsync: createOrder, isPending: isCreating, error } = useMutation({
        mutationFn: (order) => callCreateOrder(order),
        onSuccess: (data) => {
            queryClient.invalidateQueries("orders");
            return data;
        },
        onError: () => {
            toast.error("Tạo đơn hàng thất bại");
        }
    })

    return { createOrder, isCreating, error };
}