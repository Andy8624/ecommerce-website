import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callUpdateUserProfile } from "../../../services/UserService";

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const { mutate: updateProfile, isPending: isUpdating } = useMutation({
        mutationFn: ({ data, userId }) => {
            return callUpdateUserProfile(data, userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries("users");
        }
    })

    return { updateProfile, isUpdating }
}