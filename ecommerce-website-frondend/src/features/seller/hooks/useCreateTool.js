import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTool } from "../../../services/ToolService";
import { toast } from "react-toastify";

export function useCreateTool() {
    const queryClient = useQueryClient();

    const { mutate: createNewTool, isLoading: isCreating } = useMutation({
        mutationFn: createTool,
        onSuccess: () => {
            toast.success("Thêm sản phẩm thành công!");
            queryClient.invalidateQueries(["tools"]);
        },
    });

    return { createNewTool, isCreating };
}
