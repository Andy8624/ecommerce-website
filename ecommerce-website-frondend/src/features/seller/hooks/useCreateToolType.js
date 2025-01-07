import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callCreateToolType } from "../../../services/ToolTypeService";

export function useCreateToolType() {
    const queryClient = useQueryClient();
    const { isLoading: isCreating, mutateAsync: createToolType } = useMutation({
        mutationFn: callCreateToolType,
        onSuccess: () => {
            queryClient.invalidateQueries(["toolTypes"]);
        }
    });

    return { createToolType, isCreating };
}
