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
    try {
        // Tạo đối tượng dữ liệu đăng ký phù hợp với controller backend
        const data = {
            fullName,
            email,
            password,
            // Thêm các thông tin bổ sung
            imageUrl: null, // Mặc định không có ảnh đại diện
        };

        // Gọi API đăng ký
        const response = await axios.post(`/api/v1/auth/register`, data);

        // Trả về kết quả với cấu trúc thống nhất
        return {
            success: true,
            data: response.data,
            message: "Đăng ký tài khoản thành công"
        };
    } catch (error) {
        console.error("Registration error:", error);

        // Xử lý lỗi và trả về thông báo lỗi phù hợp
        const errorMessage = error.response?.data?.message ||
            "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.";

        return {
            success: false,
            message: errorMessage,
            error: error.response?.data || error.message
        };
    }
};

export const resetPassword = async (email) => {
    try {
        // Gửi email trong đối tượng JSON với key là "email"
        const response = await axios.post('/api/v1/auth/reset-password', {
            email: email
        });

        return {
            success: true,
            message: "Email khôi phục mật khẩu đã được gửi",
            data: response.data
        };
    } catch (error) {
        console.error("Reset password error:", error);

        const errorMessage = error.response?.data ||
            "Không thể gửi email khôi phục mật khẩu. Vui lòng thử lại sau.";

        return {
            success: false,
            message: errorMessage,
            error: error.response?.data || error.message
        };
    }
};

export const setNewPassword = async (email, newPassword) => {
    console.log("email", email);
    console.log("newPassword", newPassword);
    try {
        // Gửi email và mật khẩu mới trong đối tượng JSON
        const response = await axios.post('/api/v1/auth/update-password', {
            email: email,
            newPassword: newPassword
        });

        return {
            success: true,
            message: "Mật khẩu đã được đặt lại thành công",
            data: response.data
        };
    } catch (error) {
        console.error("Set new password error:", error);

        const errorMessage = error.response?.data ||
            "Không thể đặt lại mật khẩu. Vui lòng thử lại sau.";

        return {
            success: false,
            message: errorMessage,
            error: error.response?.data || error.message
        };
    }
}

export const verifyOtp = async (email, otp) => {
    try {
        const response = await axios.post('/api/v1/auth/verify-otp', {
            email: email,
            otp: otp
        });

        return {
            success: true,
            message: "Xác thực OTP thành công",
            data: response.data
        };
    } catch (error) {
        console.error("Verify OTP error:", error);

        const errorMessage = error.response?.data ||
            "Xác thực OTP không thành công. Vui lòng thử lại.";

        return {
            success: false,
            message: errorMessage,
            error: error.response?.data || error.message
        };
    }

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
