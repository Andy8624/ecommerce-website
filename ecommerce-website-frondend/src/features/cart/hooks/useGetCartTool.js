import { useQuery } from "@tanstack/react-query";
import { getToolOfCart } from "../../../services/CartToolService";

export function useGetCartTool(cartId) {
    const { data: cartTools, isLoading, error } = useQuery({
        queryKey: ["cart-tools", cartId], // Thêm cartId vào queryKey để định danh duy nhất
        queryFn: () => getToolOfCart(cartId),
        enabled: !!cartId, // Chỉ thực hiện query khi cartId có giá trị
    });

    return { cartTools, isLoading, error };
}
