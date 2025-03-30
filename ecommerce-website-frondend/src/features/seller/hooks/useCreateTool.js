import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTool } from "../../../services/ToolService";

export function useCreateTool() {
    const queryClient = useQueryClient();

    const { mutateAsync: createNewTool, isLoading: isCreating } = useMutation({
        mutationFn: createTool,
        onSuccess: () => {
            queryClient.invalidateQueries(["tools"]);
        },
    });

    return { createNewTool, isCreating };
}
