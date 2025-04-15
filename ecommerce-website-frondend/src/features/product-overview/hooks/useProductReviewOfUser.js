import { useQuery } from "@tanstack/react-query";
import { callGetProductReviewOfUser, callGetProductReview } from "../../../services/ProductReviewService";

export function useProductReviewOfUser(buyerId, toolId) {
    const { data: userReviews, isLoading, error } = useQuery({
        queryKey: ["product-reviews", toolId, buyerId],
        queryFn: () => callGetProductReviewOfUser(buyerId, toolId),
        enabled: !!toolId && !!buyerId,
    });

    return { userReviews, isLoading, error };
}

export function useProductReview(toolId) {
    const { data: productReviews, isLoading, error } = useQuery({
        queryKey: ["product-reviews", toolId],
        queryFn: () => callGetProductReview(toolId),
        enabled: !!toolId,
    });

    return { productReviews, isLoading, error };
}