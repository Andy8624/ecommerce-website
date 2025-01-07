import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callCreateOrderTool } from "../../../services/OrderToolService";
import { toast } from "react-toastify";

export function useCreateOrderTool() {
    const queryClient = useQueryClient();
    const { mutate: createOrderTool, isLoading: isCreating } = useMutation({
        mutationFn: (order) => callCreateOrderTool(order),
        onSuccess: () => {
            queryClient.invalidateQueries("order-tools");
        },
        onError: () => {
            toast.error("Tạo đơn hàng thất bại");
        }
    })

    return { createOrderTool, isCreating };
}