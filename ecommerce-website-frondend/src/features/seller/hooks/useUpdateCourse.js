import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callUpdateCourse } from "../../../services/CourseService";

export function useUpdateCourse() {
    const queryClient = useQueryClient();
    const { mutate: updateCourse, isPending: isUpdating } = useMutation({
        mutationFn: ({ data, courseId }) => {
            return callUpdateCourse(data, courseId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries("courses");
        }
    })

    return { updateCourse, isUpdating }
}