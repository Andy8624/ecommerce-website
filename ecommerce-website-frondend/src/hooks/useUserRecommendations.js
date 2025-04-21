import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRecommendationList } from '../services/RecomendationService';
import { useSelector } from 'react-redux';

export const useUserRecommendations = (quantity = 10) => {
    const queryClient = useQueryClient();
    const user = useSelector(state => state.account?.user);
    const userId = user?.id;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['userRecommendations', userId, quantity],
        queryFn: async () => {
            // if (!userId) return { recommendations: [] };
            return await getRecommendationList(userId, quantity);
        },
        // enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Function to invalidate cache and trigger refetch
    const refreshRecommendations = () => {
        queryClient.invalidateQueries({ queryKey: ['userRecommendations', userId, quantity] });
    };

    return {
        recommendations: data || [],
        isLoading,
        error,
        refetch,
        refreshRecommendations
    };
};