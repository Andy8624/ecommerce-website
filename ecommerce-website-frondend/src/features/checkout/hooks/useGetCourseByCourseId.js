import { useMutation } from "@tanstack/react-query";
import { callGetCourseByCourseId } from "../../../services/CourseService";

export function useGetCourseByCourseId() {
    const { mutateAsync: getCourseByCourseId, isLoading: isLoadingCourse, error } = useMutation({
        mutationKey: ["courses"],
        mutationFn: (courseId) => {
            if (courseId) {
                return callGetCourseByCourseId(courseId);
            }
        },
    });

    return { getCourseByCourseId, isLoadingCourse, error };
}