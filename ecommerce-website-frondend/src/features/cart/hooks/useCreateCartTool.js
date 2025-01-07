import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createCartTool } from "../../../services/CartToolService";
import { toast } from "react-toastify";

export function useCreateCartTool() {
    const queryClient = useQueryClient();
    const { mutate: createCartItem, isPending: isCreating } = useMutation({
        mutationFn: (data) => createCartTool(data),
        onSuccess: () => {
            toast.success("Thêm vào giỏ hàng thành công");
            queryClient.invalidateQueries("cart-tools");
        },
        onError: () => {
            toast.error("Thêm vào giỏ hàng thất bại");
        }
    })
    return { createCartItem, isCreating };
}