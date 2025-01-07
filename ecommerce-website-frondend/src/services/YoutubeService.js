import axios from "axios";
import { parseDuration } from "../features/courses/hooks/formatDuration";
import { toast } from "react-toastify";

const API_KEY_YOUTUBE = 'AIzaSyC-g79eTR0o6Bl7cp8T5gVSFnLpcrgisjI';

// Hàm lấy id từ url playlist
export function getPlaylistId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:playlist\?list=|(?:.*\/)?(?:p|list)\/))([\w-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Hàm xây dựng URL API YouTube
function buildApiUrl(type, params) {
    const baseUrl = "https://www.googleapis.com/youtube/v3";
    return `${baseUrl}/${type}?${new URLSearchParams({ ...params, key: API_KEY_YOUTUBE }).toString()}`;
}

// Hàm lấy thời lượng của video
async function fetchVideoDuration(videoId) {
    const url = buildApiUrl("videos", { part: "contentDetails", id: videoId });
    const response = await axios.get(url);
    const videoDetails = response.data;

    if (videoDetails.items && videoDetails.items.length > 0) {
        const videoDuration = videoDetails.items[0].contentDetails.duration;
        return parseDuration(videoDuration);
    }
    return 0;
}

// Hàm kiểm tra playlist có tồn tại không
export async function checkIfPlaylistExists(playlistUrl) {
    const playlistId = getPlaylistId(playlistUrl);

    if (!playlistId) {
        // toast.error("URL không đúng định dạng");
        return false;
    }

    const url = buildApiUrl("playlists", { part: "id", id: playlistId });

    try {
        const response = await axios.get(url);
        return response.data.items && response.data.items.length > 0;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // toast.error("Playlist không tồn tại");
            return false;
        }
    }
}

// Hàm lấy thông tin một playlist
export async function fetchPlaylistDetails(playlistUrl) {
    const playlistId = getPlaylistId(playlistUrl);

    if (!playlistId) {
        toast.error("URL không đúng định dạng");
    }

    const playlistApiUrl = buildApiUrl("playlists", { part: "snippet,contentDetails", id: playlistId });
    const videoApiUrl = buildApiUrl("playlistItems", { part: "snippet", maxResults: 50, playlistId });

    try {
        // Lấy thông tin playlist
        const playlistResponse = await axios.get(playlistApiUrl);
        const playlistData = playlistResponse.data;

        const playlist = playlistData.items[0];
        const playlistDetails = {
            title: playlist.snippet.title,
            description: playlist.snippet.description,
            thumbnail: playlist.snippet.thumbnails.high.url,
            videoCount: playlist.contentDetails.itemCount,
            publishedAt: playlist.snippet.publishedAt,
            channelTitle: playlist.snippet.channelTitle,
            totalDuration: 0,
            videos: []
        };

        // Lấy thông tin các video trong playlist
        const videoResponse = await axios.get(videoApiUrl);
        const videoData = videoResponse.data;

        let totalDurationInSeconds = 0;

        if (videoData.items && videoData.items.length > 0) {
            for (let videoItem of videoData.items) {
                const video = {
                    title: videoItem.snippet.title,
                    videoId: videoItem.snippet.resourceId.videoId,
                    description: videoItem.snippet.description,
                    thumbnail: videoItem.snippet.thumbnails.medium.url,
                    publishedAt: videoItem.snippet.publishedAt,
                    duration: 0,
                };

                // Gọi hàm fetchVideoDuration để lấy thời gian của video
                video.duration = await fetchVideoDuration(video.videoId);
                totalDurationInSeconds += video.duration;

                playlistDetails.videos.push(video);
            }
        }

        playlistDetails.totalDuration = totalDurationInSeconds;

        return playlistDetails;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Hàm lấy thông tin chi tiết của tất cả playlist
export async function fetchAllPlaylistDetails(allPlayList) {
    const courseUrls = allPlayList.map(course => course.courseUrl);
    const allPlaylistDetails = [];

    for (let url of courseUrls) {
        try {
            const details = await fetchPlaylistDetails(url);
            allPlaylistDetails.push({
                ...allPlayList.find(course => course.courseUrl === url),
                playlistDetails: details
            });
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết khóa học có url: ' + url, error);
        }
    }

    return allPlaylistDetails;
}

// Hàm lấy tên playlist từ url
export async function fetchPlaylistTitle(playlistUrl) {
    const playlistId = getPlaylistId(playlistUrl);
    const playlistApiUrl = buildApiUrl("playlists", { part: "snippet", id: playlistId });

    const response = await axios.get(playlistApiUrl);
    const playlistData = response.data;

    return playlistData.items[0].snippet.title;
}

import custom_axios from "./axios-customize";
export async function callCheckUrlExistInDb(playlistId) {
    const res = await custom_axios.get(`/api/v1/courses/playlistId/${playlistId}`);
    // console.log(res);
    return res?.data;
}