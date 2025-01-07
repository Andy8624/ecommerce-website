import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserCart } from "../../../services/CartService";

export function useCartByUserId() {
    const queryClient = useQueryClient();

    const { mutateAsync: getCartByUserId } = useMutation({
        mutationFn: getUserCart,
        onSuccess: () => {
            // console.log('Cart fetched successfully', data);
            queryClient.invalidateQueries('cart');
        }
    });

    return { getCartByUserId };
}
