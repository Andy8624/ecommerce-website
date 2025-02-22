import { useMutation } from "@tanstack/react-query";
import { callUpdateUserRoleByUserId } from "../../../services/UserService";

export function useUpdateUserRoleByUserId() {
    const { mutateAsync: updateUserRole, isPending: isUpdating } = useMutation({
        mutationFn: ({ userId, data }) => { callUpdateUserRoleByUserId(userId, data) },
    })

    return {
        updateUserRole,
        isUpdating
    }
}