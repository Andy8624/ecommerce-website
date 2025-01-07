import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callCreateCourse } from "../../../services/CourseService";

export function useCreateCourse() {
    const queryClient = useQueryClient();
    const { mutate: createCourse, isPending: isCreatingCourse } = useMutation({
        mutationFn: (data) => callCreateCourse(data),
        onSuccess: () => {
            queryClient.invalidateQueries("courses");
        },
    })
    return { createCourse, isCreatingCourse };
}