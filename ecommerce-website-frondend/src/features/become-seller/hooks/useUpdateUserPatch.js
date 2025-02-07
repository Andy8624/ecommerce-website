import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { callUpdateUserPatch } from "../../../services/UserService";

export function useUpdateUserPatch() {
    const queryClient = useQueryClient()
    const { mutateAsync: updateUser, isLoading: isUpdating, error } = useMutation({
        mutationFn: ({ data, userId }) => callUpdateUserPatch(data, userId),
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
        onError: () => {
            toast.error("Cập nhật thông tin user thất bại");
        }
    })

    return { updateUser, isUpdating, error }
}