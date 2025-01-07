import { useQuery } from "@tanstack/react-query";
import { callGetOrderCourseByUserId } from "../services/OrderCourseService";

export function useGetRegisterCourses(userId) {
    const { data: registerCourses, isLoading, error } = useQuery({
        queryKey: ["register-courses", userId],
        queryFn: () => callGetOrderCourseByUserId(userId),
        enabled: !!userId,
    })

    return { registerCourses, isLoading, error };
}