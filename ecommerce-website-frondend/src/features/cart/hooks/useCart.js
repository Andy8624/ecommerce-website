import { useQuery } from "@tanstack/react-query";
import { getUserCart } from "../../../services/CartService";


export function useCart(userId) {
    const { isLoading, data: carts, error } = useQuery({
        queryKey: ["carts"],
        queryFn: () => getUserCart(userId),
        enabled: !!userId,
    });

    return { isLoading, error, carts };
}
