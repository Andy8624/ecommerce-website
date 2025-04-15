import { callCreateProductReview } from '../../../services/ProductReviewService';
import { useMutation } from '@tanstack/react-query';

export function useCreateProductReview() {
    // const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data) => callCreateProductReview(data),
        // onSuccess: () => {
        //     queryClient.invalidateQueries(['orders']);
        //     queryClient.invalidateQueries(['product']);
        //     queryClient.invalidateQueries(['product-previews']);
        // },
        onError: (error) => {
            console.error('Error creating product review:', error);
        }
    });

    return {
        createProductReviewAsync: mutateAsync,
        isLoading: isPending,
    };
}