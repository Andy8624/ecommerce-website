import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callSearchProductByImage } from "../services/ImageSearchService";

export function useImageSearch() {
    const queryClient = useQueryClient();

    const { mutate: searchByImage, isLoading, data: searchImageData, error } = useMutation({
        mutationFn: callSearchProductByImage,
        onSuccess: (data) => {
            queryClient.setQueryData(["imageSearchResults"], data);
        },
    });

    return { searchByImage, isLoading, searchImageData, error };
}
