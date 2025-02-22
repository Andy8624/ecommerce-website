import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { callGetShippingMethod, callUpdateShippingMethod } from "../../../services/UserService"
import { toast } from "react-toastify"

export function useShippingMethod(userId) {
    const { data: shippingMethod, error, isLoading } = useQuery({
        queryKey: ["shippingMethod", userId],
        queryFn: () => callGetShippingMethod(userId),
        enabled: !!userId
    })

    return { shippingMethod, error, isLoading }
}

export function useUpdateShippingMethod() {
    const queryClient = useQueryClient()
    const { mutateAsync: updateShippingMethod, isLoading: isUpdating, error } = useMutation({
        mutationFn: ({ data, userId }) => callUpdateShippingMethod(data, userId),
        onSuccess: () => {
            queryClient.invalidateQueries(["shippingMethod"]);
            toast.success("Lưu thông tin thành công!");
        },
        onError: () => {
            toast.error("Cập nhật phương thức vận chuyển thất bại");
        }
    })

    return { updateShippingMethod, isUpdating, error }
}