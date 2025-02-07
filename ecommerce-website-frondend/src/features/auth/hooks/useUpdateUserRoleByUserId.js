import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callUpdateUserRoleByUserId } from "../../../services/UserService";

export function useUpdateUserRoleByUserId() {
    const queryClient = useQueryClient();
    const { mutateAsync: updateUserRole, isPending: isUpdating } = useMutation({
        mutationFn: (data) => { callUpdateUserRoleByUserId(data) },
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        }
    })

    return {
        updateUserRole,
        isUpdating
    }
}