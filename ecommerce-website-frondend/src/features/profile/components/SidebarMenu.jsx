import { Layout, Menu, Avatar, Typography } from "antd";
import {
    UserOutlined,
    LockOutlined,
    BankOutlined,
    HomeOutlined,
    BellOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { AVT_URL } from "../../../utils/Config";
import { useGetUserById } from "../hooks/useGetUserByUserId";

const { Sider } = Layout;
const { Title } = Typography;

const menuItems = [
    {
        key: "profile",
        icon: <UserOutlined style={{ fontSize: "20px" }} />,
        label: "Hồ Sơ"
    },
    {
        key: "password",
        icon: <LockOutlined style={{ fontSize: "20px" }} />,
        label: "Đổi Mật Khẩu"
    },
    {
        key: "address",
        icon: <HomeOutlined style={{ fontSize: "20px" }} />,
        label: "Địa Chỉ giao hàng"
    },
    {
        key: "notifications",
        icon: <BellOutlined style={{ fontSize: "20px" }} />,
        label: "Cài Đặt Thông Báo"
    },
    {
        key: "privacy",
        icon: <SettingOutlined style={{ fontSize: "20px" }} />,
        label: "Thiết Lập Riêng Tư"
    },
    {
        key: "bank",
        icon: <BankOutlined style={{ fontSize: "20px" }} />,
        label: "Phương thức thanh toán"
    },
];

const SidebarMenu = ({ selectedMenu, setSelectedMenu }) => {
    const user = useSelector(state => state?.account?.user);
    const { getUserById } = useGetUserById(user?.id);

    return (
        <Sider width={250} style={{ background: "#fff", borderRight: "1px solid #ddd" }}>
            {/* Avatar và Tên người dùng */}
            <div style={{ textAlign: "center", padding: "20px", marginTop: "25px" }}>
                <Avatar
                    size={108}
                    icon={<UserOutlined />}
                    src={AVT_URL + getUserById?.imageUrl}
                />
                <Title level={4} style={{ marginTop: "10px", color: "#333" }}>
                    {getUserById?.fullName}
                </Title>
            </div>

            {/* Menu */}
            <Menu
                mode="inline"
                selectedKeys={[selectedMenu]}
                onClick={(e) => setSelectedMenu(e.key)}
                className="profile-menu"
            >
                {menuItems.map((item) => (
                    <Menu.Item key={item.key} icon={item.icon}>
                        {item.label}
                    </Menu.Item>
                ))}
            </Menu>
        </Sider>
    );
};

export default SidebarMenu;
