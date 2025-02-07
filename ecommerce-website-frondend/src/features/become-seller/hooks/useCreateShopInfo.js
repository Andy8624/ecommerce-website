import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { callCreateShopInfo } from "../../../services/UserService";

export function useCreateShopInfo() {
    const queryClient = useQueryClient()
    const { mutateAsync: createShopInfo, isLoading: isCreatingShop, error } = useMutation({
        mutationFn: (data) => callCreateShopInfo(data),
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
        onError: () => {
            toast.error("Cập nhật thông tin cửa hàng thất bại");
        }
    })

    return { createShopInfo, isCreatingShop, error }
}