import { useQuery } from '@tanstack/react-query';
import { fetchAllPlaylistDetails } from '../../../services/YoutubeService';

export function usePlaylistsDetails(courseData) {
    const { data: playlistsDetails, isLoading, isError, error } = useQuery({
        queryKey: ['playlistsDetails', courseData],
        queryFn: () => fetchAllPlaylistDetails(courseData),
        enabled: courseData && courseData.length > 0,
    }
    );

    return {
        playlistsDetails,
        isLoading,
        isError,
        error: isError ? error.message : null,
    };
}
