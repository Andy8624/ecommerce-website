import axios from "./axios-customize"
import basic_axios from "axios"
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Cookies from "js-cookie";


async function getDeviceId() {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
}

// Hàm lấy địa chỉ IP 
const getUserIP = async () => {
    try {
        const response = await basic_axios.get("https://api.ipify.org?format=json");
        if (response.status === 200 && response.data?.ip) {
            return response.data.ip;
        }
        throw new Error("Invalid IP response");
    } catch (error) {
        console.error("Error fetching IP:", error.message);
        return null;
    }
};


// Hàm lấy User-Agent từ trình duyệt
const getUserAgent = () => {
    console.log(navigator.userAgentData);
    console.log(navigator.userAgentData?.brands[0].brand);
    const isMobile = navigator.userAgentData?.mobile ? "Mobile" : "Desktop";
    const userAgent =
        navigator.userAgentData?.brands[0]?.brand + "|" +
        navigator.userAgentData?.brands[1]?.brand + "|" +
        navigator.userAgentData?.brands[2]?.brand + "|" +
        navigator.userAgentData?.platform + "|" + isMobile;
    // console.log(userAgent);
    return typeof navigator !== "undefined" ? userAgent : "Unknown";
};


export const login = async (email, password) => {
    const ip = await getUserIP();
    const userAgent = getUserAgent();
    // console.log("userAgent", userAgent);
    const device_id = await getDeviceId();

    // Lưu vào cookies với thời gian hết hạn 1 năm
    Cookies.set("device_id", device_id, { expires: 365, path: "/", secure: true });

    const data = { email, password, ip, userAgent, deviceId: device_id };
    return axios.post(`/api/v1/auth/login`, data);
}

export const register = async (email, password, fullName) => {
    const ip = await getUserIP();
    const userAgent = getUserAgent();
    const device_id = await getDeviceId();

    // Lưu vào cookies với thời gian hết hạn 1 năm
    Cookies.set("device_id", device_id, { expires: 365, path: "/", secure: true });

    const data = { email, password, fullName, ip, userAgent, deviceId: device_id };
    return axios.post(`/api/v1/auth/register`, data);
}

export const resetPassword = async (email) => {
    const ip = await getUserIP();
    const userAgent = getUserAgent();
    const device_id = await getDeviceId();

    // Lưu vào cookies với thời gian hết hạn 1 năm
    Cookies.set("device_id", device_id, { expires: 365, path: "/", secure: true });

    const data = { email, ip, userAgent, deviceId: device_id };
    return axios.post(`/api/v1/auth/reset-password`, data);
}


export const getAccount = async () => {
    const path = `/api/v1/auth/account`;
    const res = await axios.get(path);
    // console.log(res);
    return res;
}

export const checkEmailExists = async (email) => {
    return axios.get(`/api/v1/auth/check-email/${email}`);
};

export const callLogout = async (data) => {
    const device_id = await getDeviceId();
    return axios.post(`/api/v1/auth/logout`, { ...data, device_id });
}
// /login-history/{userId}/{limit}
export const callGetLoginHistory = async (userId, limit) => {
    const path = `/api/v1/auth/login-history/${userId}/${limit}`;
    const res = await axios.get(path);
    return res?.data;
}
