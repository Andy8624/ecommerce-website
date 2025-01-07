import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callDeleteCartTool } from "../../../services/CartToolService";

export default function useDeleteCartTool() {
    const queryClient = useQueryClient();
    const { mutate: deleteCartTool, isPending: isDelete } = useMutation({
        mutationFn: (cartToolId) => callDeleteCartTool(cartToolId),
        onSuccess: () => {
            queryClient.invalidateQueries("cart-tools");
        }
    });
    return { deleteCartTool, isDelete };
}