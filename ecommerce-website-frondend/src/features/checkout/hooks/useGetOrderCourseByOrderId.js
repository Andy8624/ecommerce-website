import { useMutation } from "@tanstack/react-query";
import { callGetOrderCourseByOrderId } from "../../../services/OrderCourseService";

export function useGetOrderCourseByOrderId() {
    const { mutateAsync: getOrderCourseByOrderId, isLoading, error } = useMutation({
        mutationKey: ["order-courses"],
        mutationFn: (orderId) => {
            if (orderId) {
                return callGetOrderCourseByOrderId(orderId);
            }
        },
    });

    return { getOrderCourseByOrderId, isLoading, error };
}
