import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callCreateOrderCourse } from "../../../services/OrderCourseService";
import { toast } from "react-toastify";

export function useCreateOrderCourse() {
    const queryClient = useQueryClient()
    const { mutateAsync: createOrderCourse, isLoading, error } = useMutation({
        mutationFn: (orderCourse) => callCreateOrderCourse(orderCourse),
        onSuccess: (data) => {
            queryClient.invalidateQueries("order-courses");
            return data;
        },
        onError: () => {
            toast.error("Mua khóa học thất bại");
        }
    })

    return { createOrderCourse, isLoading, error }
}