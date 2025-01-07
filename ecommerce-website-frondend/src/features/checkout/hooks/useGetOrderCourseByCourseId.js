import { useQuery } from "@tanstack/react-query";
import { callGetOrderCourseByCourseId } from "../../../services/OrderCourseService";

export function useGetOrderCourseByCourseId(courseId) {
    const { data: getOrderCourseByCourseId, isLoading, error } = useQuery({
        queryKey: ["order-courses"],
        queryFn: () => {
            if (courseId) {
                return callGetOrderCourseByCourseId(courseId);
            }
        },
        enabled: !!courseId,
    });

    return { getOrderCourseByCourseId, isLoading, error };
}
