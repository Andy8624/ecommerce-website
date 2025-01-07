import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callGetOrderToolByToolId } from "../../../services/OrderToolService";

export function useGetOrderToolByToolId() {
    const queryClient = useQueryClient();
    const { mutateAsync: getOrderToolByToolId, isLoading, error } = useMutation({
        mutationFn: (toolId) => {
            if (toolId) {
                return callGetOrderToolByToolId(toolId);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["order-tools"]);
            queryClient.invalidateQueries(["orders"]);
        },
    });

    return { getOrderToolByToolId, isLoading, error };
}
