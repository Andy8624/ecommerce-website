import { useMutation, useQueryClient } from "@tanstack/react-query"
import { callUpdateTaxAndIdentityInfo } from "../../../services/UserService"
import { toast } from "react-toastify"

export function useUpdateTaxAndIdentityInfo() {
    const queryClient = useQueryClient()
    const { mutateAsync: updateTaxAndIdentityInfo, isLoading: isUpdating, error } = useMutation({
        mutationFn: ({ data, userId }) => callUpdateTaxAndIdentityInfo(data, userId),
        onSuccess: () => {
            queryClient.invalidateQueries(["taxAndIdentityInfo"]);
            toast.success("Lưu thông tin thành công!");
        },
        onError: () => {
            toast.error("Cập nhật thông tin thất bại");
        }
    })

    return { updateTaxAndIdentityInfo, isUpdating, error }
}