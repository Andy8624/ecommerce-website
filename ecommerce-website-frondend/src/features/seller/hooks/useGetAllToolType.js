import { useQuery } from "@tanstack/react-query";
import { callGetAllToolTypes } from "../../../services/ToolTypeService";

export function useGetAllToolType() {
    const { data: toolTypes, isLoading, error } = useQuery({
        queryKey: ["toolTypes"],
        queryFn: callGetAllToolTypes,
    });

    return { toolTypes, isLoading, error };
}