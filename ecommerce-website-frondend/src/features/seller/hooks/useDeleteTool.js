import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callDeleteTool } from "../../../services/ToolService";
import { toast } from "react-toastify";

export function useDeleteTool() {
    const queryClient = useQueryClient();

    const { mutate: deleteTool, isLoading: isDeleting } = useMutation({
        mutationFn: callDeleteTool,
        onSuccess: () => {
            queryClient.invalidateQueries(["tools"]);
            toast.success("Xóa sản phẩm thành công!");
        },
        onError: () => {
            toast.error("Xóa sản phẩm thất bại. Vui lòng thử lại.");
        },
    });

    return { deleteTool, isDeleting };
}
