import { useQuery } from "@tanstack/react-query"
import { callGetAllCourseByUserId } from "../../../services/CourseService"

export function useGetAllCourseByUserId(userId) {
    const { data: courses, error, isLoading, refetch } = useQuery({
        queryKey: ["courses"],
        queryFn: () => callGetAllCourseByUserId(userId),
    })

    return { courses, error, isLoading, refetch }
}