import { useQuery } from "@tanstack/react-query";
import { callGetAllToolByUserId } from "../../../services/ToolService";

export function useGetAllToolByUserId(userId) {
    const { data: tools, isLoading, error } = useQuery({
        queryKey: ["tools", userId],
        queryFn: () => callGetAllToolByUserId(userId),
        enabled: !!userId,
    });

    return { tools, isLoading, error };
}
