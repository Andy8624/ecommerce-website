import { useQuery } from "@tanstack/react-query";
import { callGetAllCourse } from "../../../services/CourseService";

export function useGetAllCourse() {
    const { data: courses, isPending: isLoading } = useQuery({
        queryKey: ["courses"],
        queryFn: () => callGetAllCourse(),
    })

    return { courses, isLoading };
}

