import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callDeleteCourse } from "../../../services/CourseService";

export function useDeleteCourse() {
    const queryClient = useQueryClient()
    const { mutate: deleteCourse, isPending: isDeleting } = useMutation({
        mutationFn: callDeleteCourse,
        onSuccess: () => {
            queryClient.invalidateQueries("course")
        }
    })

    return { deleteCourse, isDeleting }
}