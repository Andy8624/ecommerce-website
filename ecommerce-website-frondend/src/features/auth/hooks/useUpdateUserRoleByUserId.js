import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callUpdateUserRoleByUserId } from "../../../services/UserService";

export function useUpdateUserRoleByUserId() {
    const queryClient = useQueryClient();
    const { mutateAsync: updateUserRole, isPending: isUpdating } = useMutation({
        mutationKey: ['updateUserRole'],
        mutationFn: (data) => { console.log(data), callUpdateUserRoleByUserId(data) },
        onSuccess: () => {
            queryClient.invalidateQueries('getUserByUserId');
        }
    })

    return {
        updateUserRole,
        isUpdating
    }
}