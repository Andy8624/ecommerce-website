import { Mutex } from "async-mutex";
import axios from "axios";
import { store } from "../redux/store";
import { setRefreshTokenAction } from "../redux/slices/accountSlice";
import { Modal, notification } from "antd";
import Cookies from "js-cookie";

const instance = axios.create({
    baseURL: "http://localhost:8080/",
    withCredentials: true,
});

const mutex = new Mutex();
const NO_RETRY_HEADER = "x-no-retry";


const handleRefreshToken = async () => {
    console.log("begin");
    console.log(document.cookie);
    return await mutex.runExclusive(async () => {
        console.log("Refresh token...");
        try {
            const res = await instance.get("/api/v1/auth/refresh", {
                withCredentials: true, // Bật gửi cookies
            });

            console.log("Refresh token response: ", res);
            if (res && res.data) return res.data.access_token;
        } catch (error) {
            console.log("Lỗi refresh token: ", error);
            return null;
        }
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

    // Lấy device_id từ cookies và thêm vào header
    const deviceId = Cookies.get("device_id");
    if (deviceId) {
        config.headers["device_id"] = deviceId; // Thêm device_id vào request header
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
        console.log("Error: ", error?.response);
        // Trường hợp session hết hạn (do giới hạn session)
        if (error.response?.status === 409 || error.response?.status === 498) {
            console.log("Phiên đăng nhập đã hết hạn.");
            localStorage.removeItem("access_token");
            // Hiển thị modal yêu cầu đăng nhập lại
            Modal.confirm({
                title: "Phiên đăng nhập đã hết hạn",
                content: "Vui lòng đăng nhập lại để tiếp tục.",
                onOk: () => {
                    window.location.href = "/auth/login";
                },
                okText: "OK",
                cancelButtonProps: { style: { display: "none" } },
            });
        }


        // Trường hợp access_token hết hạn hoặc không hợp lệ, refresh token
        if (
            error.config &&
            error.response &&
            +error.response.status === 401 &&
            error.config.url !== "/api/v1/auth/login" &&
            !error.config.headers[NO_RETRY_HEADER]
        ) {
            console.log("Access token hết hạn, refresh token...");
            const access_token = await handleRefreshToken();

            error.config.headers[NO_RETRY_HEADER] = "true";
            console.log("Access token mới: ", access_token);
            if (access_token) {
                error.config.headers["Authorization"] = `Bearer ${access_token}`;
                localStorage.setItem("access_token", access_token);
                return instance.request(error.config);
            } else {
                localStorage.removeItem("access_token");
                console.log("Refresh token hết hạn, chuyển về trang login... STATUS: 401");
                // Hiển thị modal yêu cầu đăng nhập lại
                Modal.confirm({
                    title: "Phiên đăng nhập đã hết hạn",
                    content: "Vui lòng đăng nhập lại để tiếp tục.",
                    onOk: () => {
                        window.location.href = "/auth/login";
                    },
                    okText: "OK",
                    cancelButtonProps: { style: { display: "none" } }, // Ẩn nút Cancel
                });
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
            console.log("config", error.config);
            const message =
                error?.response?.data?.error ?? "Có lỗi xảy ra, vui lòng login.";
            console.log("Refresh token hết hạn, chuyển về trang login... STATUS: 400");
            localStorage.removeItem("access_token");
            // dispatch redux action
            store.dispatch(setRefreshTokenAction({ status: true, message }));
        }

        // Trường hợp không có quyền truy cập
        if (+error.response.status === 403) {
            console.log("Bạn không có quyền truy cập vào trang này.");
            notification.error({
                message: error?.response?.data?.message ?? "",
                description: error?.response?.data?.error ?? "",
            });
        }



        return error?.response?.data ?? Promise.reject(error);
    }
);

export default instance;
