import { useQuery } from "@tanstack/react-query";
import { callGetToolByToolId } from "../../../../services/ToolService";

export function useGetToolByToolId(toolId) {
    const {
        data: getToolById,
        isLoading: isLoadingTool,
        error
    } = useQuery({
        queryKey: ["tool", toolId],
        queryFn: () => toolId ? callGetToolByToolId(toolId) : null,
        enabled: !!toolId,
    });

    return { getToolById, isLoadingTool, error };
}