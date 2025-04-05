import { useQuery } from "@tanstack/react-query";
import { callGetLoginHistory } from "../../../services/AuthService";

export function useLoginHistory(userId, limit) {
    const { isLoading, data: loginHistory, error } = useQuery({
        queryKey: ["loginHistory", userId, limit],
        queryFn: () => callGetLoginHistory(userId, limit),
        enabled: !!userId,
    });

    return { isLoading, loginHistory, error };
}
