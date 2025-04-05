import { useSelector } from "react-redux";
import { useLoginHistory } from "../hooks/useLoginHistory";
import { Typography, Tooltip } from "antd";
import { GlobalOutlined, ClockCircleOutlined, EnvironmentOutlined, LaptopOutlined } from "@ant-design/icons";
import { FaFirefox, FaSafari, FaOpera, FaChrome, FaEdge } from "react-icons/fa";
import { SiBrave } from "react-icons/si";

const { Text, Title } = Typography;

const AccountManagement = () => {
    const userId = useSelector((state) => state?.account?.user?.id);
    const { loginHistory } = useLoginHistory(userId, 5);
    console.log(loginHistory);

    // Parse the login history data
    const parseLoginHistory = (historyItem) => {
        if (!historyItem) return null;

        // Updated format: IP|Browser|SecondaryBrand|Engine|OS|DeviceType|Timestamp
        const [ip, browser, secondaryBrand, engine, os, deviceType, timestamp] = historyItem.split('|');

        // Determine browser icon
        let browserIcon;
        let browserName = browser;

        if (browser === "Google Chrome" || browser?.includes("Chrome")) {
            browserIcon = <FaChrome style={{ fontSize: '24px', color: '#4285F4' }} />;
            browserName = "Google Chrome";
        } else if (browser === "Brave") {
            browserIcon = <SiBrave style={{ fontSize: '24px', color: '#FB542B' }} />;
            browserName = "Brave";
        } else if (browser?.includes("Firefox")) {
            browserIcon = <FaFirefox style={{ fontSize: '24px', color: '#FF7139' }} />;
            browserName = "Mozilla Firefox";
        } else if (browser?.includes("Safari")) {
            browserIcon = <FaSafari style={{ fontSize: '24px', color: '#005E9C' }} />;
            browserName = "Safari";
        } else if (browser?.includes("Edge")) {
            browserIcon = <FaEdge style={{ fontSize: '24px', color: '#0078D7' }} />;
            browserName = "Microsoft Edge";
        } else if (browser?.includes("Opera") || engine?.includes("Opera")) {
            browserIcon = <FaOpera style={{ fontSize: '24px', color: '#FF1B2D' }} />;
            browserName = "Opera";
        } else {
            browserIcon = <GlobalOutlined style={{ fontSize: '24px', color: '#555' }} />;
            browserName = browser || "Trình duyệt không xác định";
        }

        // Format date
        const date = new Date(parseInt(timestamp));
        const formattedDate = date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // If browser is undefined, handle specially
        if (browser === "undefined") {
            browserName = "Trình duyệt không xác định";
        }

        return {
            ip,
            browserIcon,
            browserName,
            formattedDate,
            deviceInfo: os !== "undefined" ? os : "Không xác định",
            deviceType: deviceType !== "undefined" ? deviceType : "Thiết bị không xác định",
            timestamp,
            engine: engine !== "undefined" ? engine : null
        };
    };

    // Function to calculate time ago
    const getTimeAgo = (timestamp) => {
        const seconds = Math.floor((new Date() - timestamp) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return `${Math.floor(interval)} năm trước`;

        interval = seconds / 2592000;
        if (interval > 1) return `${Math.floor(interval)} tháng trước`;

        interval = seconds / 86400;
        if (interval > 1) return `${Math.floor(interval)} ngày trước`;

        interval = seconds / 3600;
        if (interval > 1) return `${Math.floor(interval)} giờ trước`;

        interval = seconds / 60;
        if (interval > 1) return `${Math.floor(interval)} phút trước`;

        return `${Math.floor(seconds)} giây trước`;
    };

    return (
        <div className="">
            {/* Header */}
            <Title level={3} className="flex items-center">
                Lịch sử đăng nhập
                <Tooltip title="Hiển thị 5 lần đăng nhập gần nhất">
                    <span className="ms-3 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">5 gần nhất</span>
                </Tooltip>
            </Title>

            <br />
            {loginHistory && loginHistory.length > 0 ? (
                <div className="space-y-4">
                    {loginHistory.map((item, index) => {
                        const parsedItem = parseLoginHistory(item);
                        if (!parsedItem) return null;

                        return (
                            <div key={index} className={`${index !== loginHistory.length - 1 ? 'border-b pb-4' : ''}`}>
                                <div className="flex items-start">
                                    <div className="mr-4">
                                        {parsedItem.browserIcon}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-medium flex items-center">
                                                    {parsedItem.browserName}
                                                    {index === 0 && (
                                                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                                            Hiện tại
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <LaptopOutlined className="mr-1" />
                                                    <span>{parsedItem.deviceInfo}</span>
                                                    {parsedItem.deviceType && (
                                                        <>
                                                            <span className="mx-1">•</span>
                                                            <span>{parsedItem.deviceType}</span>
                                                        </>
                                                    )}
                                                    {parsedItem.engine && (
                                                        <>
                                                            <span className="mx-1">•</span>
                                                            <span>{parsedItem.engine}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <Tooltip title={parsedItem.formattedDate}>
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <ClockCircleOutlined className="mr-1" />
                                                    {getTimeAgo(parseInt(parsedItem.timestamp))}
                                                </div>
                                            </Tooltip>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500">
                                            <EnvironmentOutlined className="mr-1" />
                                            <Tooltip title="Địa chỉ IP">
                                                {parsedItem.ip}
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    Không có lịch sử đăng nhập nào.
                </div>
            )}

            <div className="mt-6 pt-2 border-t text-center">
                <Text type="secondary" className="text-sm">
                    Nếu bạn nhận thấy hoạt động đáng ngờ, vui lòng thay đổi mật khẩu ngay lập tức.
                </Text>
            </div>
        </div>
    );
}

export default AccountManagement;
