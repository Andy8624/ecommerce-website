
import { useQuery } from "@tanstack/react-query";
import { callGetUserByUserId } from "../services/UserService";

export function useGetUserById(userId) {
    const { isLoading, data: getUserById, error } = useQuery({
        queryKey: ["users", userId],
        queryFn: () => callGetUserByUserId(userId),
        enabled: !!userId,
    });

    return { isLoading, getUserById, error };
}
