import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateCartTool } from "../../../services/CartToolService";

export function useUpdateCartItem() {
    const queryClient = useQueryClient();

    const { mutate: updateCartItem, isLoading: isUpdating } = useMutation({
        mutationFn: ({ data, cartToolId }) => {
            return updateCartTool(data, cartToolId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries("cart-tools");
        }
    });

    return { updateCartItem, isUpdating };
}
