import { useQuery } from "@tanstack/react-query";
import { getToolOfCart } from "../../../services/CartToolService";

export function useCartTool(cartId) {
    const { isLoading, data: cartTools, error } = useQuery({
        queryKey: ["cart-tools"],
        queryFn: () => getToolOfCart(cartId),
        enabled: !!cartId,
    });

    return { isLoading, error, cartTools };
}
