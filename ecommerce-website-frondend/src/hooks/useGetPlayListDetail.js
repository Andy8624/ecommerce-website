import { useMutation } from "@tanstack/react-query";
import { fetchPlaylistDetails } from "../services/YoutubeService";

export function useGetPlayListDetail() {
    const { mutateAsync: getPlaylistDetail } = useMutation({
        mutationFn: fetchPlaylistDetails,
    })

    return { getPlaylistDetail };
}