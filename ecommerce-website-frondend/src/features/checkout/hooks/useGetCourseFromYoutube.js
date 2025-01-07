import { useQuery } from "@tanstack/react-query";
import { fetchPlaylistDetails } from "../../../services/YoutubeService";

export function useGetCourseFromYoutube(courseUrl) {
    // Kiểm tra nếu courseUrl hợp lệ trước khi gọi API
    const { data, isLoading, error } = useQuery({
        queryKey: ["courses", courseUrl],
        queryFn: () => {
            if (!courseUrl) {
                throw new Error("Course URL is required");
            }
            return fetchPlaylistDetails(courseUrl);
        },
        enabled: !!courseUrl,
    })

    return { data, isLoading, error };
}
