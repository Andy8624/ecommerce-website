import { useQuery } from "@tanstack/react-query";
import { callGetProductReview } from "../../../services/ProductReviewService";

export function useProductReview(toolId) {
    const { data: reviews, isLoading, error } = useQuery({
        queryKey: ["product-reviews", toolId],
        queryFn: () => callGetProductReview(toolId),
        enabled: !!toolId,
    });

    return { reviews, isLoading, error };
}
