import { useMutation } from "@tanstack/react-query";
import { checkExistCartTool } from "../../../services/CartToolService";

export function useCheckExistCartTool() {
    const { mutateAsync: checkExist, isPending: isLoading } = useMutation({
        mutationFn: (data) => checkExistCartTool(data),

    });

    return { checkExist, isLoading };
}
