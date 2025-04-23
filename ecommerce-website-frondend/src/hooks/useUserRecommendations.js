import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRecommendationList } from '../services/RecomendationService';
import { useSelector } from 'react-redux';

export const useUserRecommendations = (quantity = 10) => {
    const queryClient = useQueryClient();
    const user = useSelector(state => state.account?.user);
    const userId = user?.id;

    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['userRecommendations', userId, quantity],
        queryFn: async () => {
            if (!userId) {
                return [];
            }
            try {
                const result = await getRecommendationList(userId, quantity);
                return result;
            } catch (error) {
                // Chuyển đổi lỗi để có thể hiển thị thông báo thân thiện hơn
                console.error('Failed to fetch recommendations:', error);

                // Ném lỗi với thông báo rõ ràng
                throw new Error('Không thể tải gợi ý sản phẩm. Server có thể đang gặp sự cố.');
            }
        },
        enabled: !!userId,
        staleTime: 10 * 60 * 1000, // 10 phút
        cacheTime: 15 * 60 * 1000, // 15 phút
        retry: 1, // Chỉ thử lại 1 lần
        retryDelay: 5000, // Chờ 5 giây trước khi thử lại
        refetchOnWindowFocus: false, // Không tải lại khi focus lại trang
        refetchOnMount: false, // Chỉ tải dữ liệu một lần khi component mount
    });

    // Function để xóa cache và kích hoạt refetch thủ công
    const refreshRecommendations = () => {
        queryClient.invalidateQueries({ queryKey: ['userRecommendations', userId, quantity] });
    };

    return {
        recommendations: data || [],
        isLoading,
        isFetching,
        error,
        refetch,
        refreshRecommendations
    };
};