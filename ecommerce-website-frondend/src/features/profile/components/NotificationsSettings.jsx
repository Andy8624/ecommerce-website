import { useState, useEffect } from "react";
import { Typography, Switch, Card, List, Divider, Button, message } from "antd";
import {
    BellOutlined,
    MailOutlined,
    ShoppingOutlined,
    QuestionCircleOutlined,
    CheckOutlined,
    TagOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const NotificationsSettings = () => {
    // State for notification settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailEnabled: true,
        orderUpdates: true,
        promotions: true,
        customerService: true,
        accountSecurity: true,
        productStock: false,
    });
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    // Fetch user's notification settings
    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                // Replace with your actual API endpoint
                // const response = await axios.get('/api/user/notification-settings');
                // setNotificationSettings(response.data);

                // Simulated API call
                setTimeout(() => {
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error("Error fetching notification settings:", error);
                message.error("Không thể tải cài đặt thông báo. Vui lòng thử lại sau.");
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Toggle master email notifications
    const toggleEmailNotifications = (checked) => {
        setNotificationSettings((prev) => ({
            ...prev,
            emailEnabled: checked,
        }));
    };

    // Toggle individual notification types
    const toggleNotificationType = (type) => (checked) => {
        setNotificationSettings((prev) => ({
            ...prev,
            [type]: checked,
        }));
    };

    // Save notification settings
    const saveSettings = async () => {
        setSaveLoading(true);
        try {
            // Replace with your actual API endpoint
            // await axios.post('/api/user/notification-settings', notificationSettings);

            // Simulated API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            message.success("Cài đặt thông báo đã được lưu thành công.");
            setSaveLoading(false);
        } catch (error) {
            console.error("Error saving notification settings:", error);
            message.error("Không thể lưu cài đặt thông báo. Vui lòng thử lại sau.");
            setSaveLoading(false);
        }
    };

    // List of notification types
    const notificationTypes = [
        {
            key: "orderUpdates",
            title: "Cập nhật đơn hàng",
            description:
                "Nhận thông báo về trạng thái đơn hàng, giao hàng và thanh toán",
            icon: <ShoppingOutlined />,
        },
        {
            key: "promotions",
            title: "Khuyến mãi & Ưu đãi",
            description: "Nhận thông tin về khuyến mãi, giảm giá và ưu đãi đặc biệt",
            icon: <TagOutlined />,
        },
        {
            key: "customerService",
            title: "Hỗ trợ khách hàng",
            description: "Thông báo về phản hồi yêu cầu hỗ trợ và cập nhật dịch vụ",
            icon: <QuestionCircleOutlined />,
        },
        {
            key: "accountSecurity",
            title: "Bảo mật tài khoản",
            description:
                "Thông báo về đăng nhập, thay đổi mật khẩu và cập nhật bảo mật",
            icon: <CheckOutlined />,
        },
        {
            key: "productStock",
            title: "Tình trạng hàng",
            description:
                "Thông báo khi sản phẩm trong danh sách yêu thích của bạn có hàng trở lại",
            icon: <BellOutlined />,
        },
    ];

    return (
        <div loading={loading} className="shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <Title level={4} className="m-0">
                    Cài đặt thông báo
                </Title>
            </div>

            <div className="">
                {/* Main email notifications toggle */}
                <Card className="mb-6 bg-blue-50 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <MailOutlined className="text-xl text-blue-600 mr-5 ms-3" />
                            <div>
                                <Text strong className="text-lg">
                                    Email thông báo
                                </Text>
                                <Paragraph className="text-gray-600 m-0">
                                    Bật hoặc tắt tất cả thông báo qua email
                                </Paragraph>
                            </div>
                        </div>
                        <Switch
                            checked={notificationSettings.emailEnabled}
                            onChange={toggleEmailNotifications}
                            className={notificationSettings.emailEnabled ? "bg-blue-500" : ""}
                        />
                    </div>
                </Card>

                <List
                    itemLayout="horizontal"
                    dataSource={notificationTypes}
                    renderItem={(item) => (
                        <List.Item
                            key={item.key}
                            className="p-4 hover:bg-gray-50 rounded-md transition-colors"
                        >
                            <div className="flex items-center justify-between w-full mx-4">
                                <div className="flex items-start items-center justify-center">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 mr-4">
                                        {item.icon}
                                    </div>
                                    <div className="flex items-start justify-center flex-col">
                                        <Text strong>{item.title}</Text>
                                        <Paragraph className="text-gray-500 m-0 text-sm">
                                            {item.description}
                                        </Paragraph>
                                    </div>
                                </div>
                                <Switch
                                    disabled={!notificationSettings.emailEnabled}
                                    checked={
                                        notificationSettings.emailEnabled &&
                                        notificationSettings[item.key]
                                    }
                                    onChange={toggleNotificationType(item.key)}
                                    className={
                                        notificationSettings.emailEnabled &&
                                            notificationSettings[item.key]
                                            ? "bg-blue-500"
                                            : ""
                                    }
                                />
                            </div>
                        </List.Item>
                    )}
                />
            </div>

            <div className="flex justify-end mt-4">
                <Button
                    type="primary"
                    onClick={saveSettings}
                    loading={saveLoading}
                    disabled={!notificationSettings.emailEnabled}
                >
                    Lưu cài đặt
                </Button>
            </div>
        </div>
    );
};

export default NotificationsSettings;
