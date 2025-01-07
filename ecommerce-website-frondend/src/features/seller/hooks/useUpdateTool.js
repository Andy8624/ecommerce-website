import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callUpdateTool } from "../../../services/ToolService";
import { toast } from "react-toastify";

export function useUpdateTool() {
    const queryClient = useQueryClient();

    const { mutate: updateTool, isLoading: isUpdating } = useMutation({
        mutationFn: ({ toolId, updatedTool }) => callUpdateTool(toolId, updatedTool),
        onSuccess: () => {
            queryClient.invalidateQueries(["tools"]);
            toast.success("Cập nhật sản phẩm thành công!");
        },
        onError: () => {
            toast.error("Cập nhật sản phẩm thất bại. Vui lòng thử lại.");
        },
    });

    return { updateTool, isUpdating };
}
