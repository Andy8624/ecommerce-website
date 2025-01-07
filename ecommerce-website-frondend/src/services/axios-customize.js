import { Mutex } from "async-mutex";
import axios from "axios";
import { store } from "../redux/store";
import { setRefreshTokenAction } from "../redux/slices/accountSlice";
import { notification } from "antd";

const instance = axios.create({
    baseURL: "http://localhost:8080/",
    withCredentials: true,
});

const mutex = new Mutex();
const NO_RETRY_HEADER = "x-no-retry";

const handleRefreshToken = async () => {
    return await mutex.runExclusive(async () => {
        const res = await instance.get("/api/v1/auth/refresh");
        if (res && res.data) return res.data.access_token;
        return null;
    });
};

instance.interceptors.request.use(function (config) {
    // thêm access_token (từ localStorage nếu có) vào header cho mỗi request
    if (
        typeof window !== "undefined" &&
        window.localStorage &&
        window.localStorage.getItem("access_token")
    ) {
        config.headers.Authorization =
            "Bearer " + window.localStorage.getItem("access_token");
    }

    // dữ liệu được gửi và nhận dưới dạng json
    if (!config.headers.Accept && config.headers["Content-Type"]) {
        config.headers.Accept = "application/json";
        config.headers["Content-Type"] = "application/json; charset=utf-8";
    }
    return config;
});


instance.interceptors.response.use(
    (res) => res.data,
    async (error) => {
        // Trường hợp access_token hết hạn hoặc không hợp lệ, refresh token
        if (
            error.config &&
            error.response &&
            +error.response.status === 401 &&
            error.config.url !== "/api/v1/auth/login" &&
            !error.config.headers[NO_RETRY_HEADER]
        ) {
            const access_token = await handleRefreshToken();
            error.config.headers[NO_RETRY_HEADER] = "true";

            if (access_token) {
                error.config.headers["Authorization"] = `Bearer ${access_token}`;
                localStorage.setItem("access_token", access_token);
                return instance.request(error.config);
            }
        }

        // Trường hợp refresh token hết hạn (ở trang admin) -> chuyển về trang login 
        if (
            error.config &&
            error.response &&
            +error.response.status === 400 &&
            error.config.url === "/api/v1/auth/refresh" &&
            location.pathname.startsWith("/admin")
        ) {
            const message =
                error?.response?.data?.error ?? "Có lỗi xảy ra, vui lòng login.";
            // dispatch redux action
            store.dispatch(setRefreshTokenAction({ status: true, message }));
        }

        // Trường hợp không có quyền truy cập
        if (+error.response.status === 403) {
            notification.error({
                message: error?.response?.data?.message ?? "",
                description: error?.response?.data?.error ?? "",
            });
        }

        return error?.response?.data ?? Promise.reject(error);
    }
);

export default instance;
