import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callUpdate } from "../../../services/Service";

export function useUpdate() {
    const queryClient = useQueryClient();
    const { mutate: update, isPending: isUpdating } = useMutation({
        mutationFn: ({ data, Id }) => {
            return callUpdate(data, Id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries("s");
        }
    })

    return { update, isUpdating }
}