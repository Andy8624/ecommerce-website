import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callUpdateTool } from "../../../services/ToolService";
import { toast } from "react-toastify";

export function useUpdateTool() {
    const queryClient = useQueryClient();

    const { mutateAsync: updateTool, isPending: isUpdating } = useMutation({
        mutationFn: ({ toolId, updatedTool }) => callUpdateTool(toolId, updatedTool),
        onSuccess: (data) => {
            toast.success("Cập nhật sản phẩm thành công");
            queryClient.invalidateQueries({ queryKey: ["tools"] });
            return data;
        },
        onError: (error) => {
            console.error("Error updating tool:", error);
            toast.error(`Lỗi khi cập nhật sản phẩm: ${error.message || "Vui lòng thử lại sau"}`);
            return null;
        },
    });

    return { updateTool, isUpdating };
}
