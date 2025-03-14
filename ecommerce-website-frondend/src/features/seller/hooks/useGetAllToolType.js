import { useQuery } from "@tanstack/react-query";
import { callGetAllToolTypes } from "../../../services/ToolTypeService";

export function useGetAllToolType() {
    const { data: toolTypes, isLoadingToolTypes, error } = useQuery({
        queryKey: ["toolTypes"],
        queryFn: callGetAllToolTypes,
    });

    return { toolTypes, isLoadingToolTypes, error };
}