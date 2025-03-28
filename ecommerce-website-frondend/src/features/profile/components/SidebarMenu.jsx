import { Layout, Menu, Avatar } from "antd";
// eslint-disable-next-line no-unused-vars
import React from 'react';
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
        label: "Phương Thức Thanh Toán"
    },
];

const SidebarMenu = ({ selectedMenu, setSelectedMenu }) => {
    const user = useSelector(state => state?.account?.user);
    const { getUserById } = useGetUserById(user?.id);

    return (
        <Sider width={300} style={{ background: "#fff", borderRight: "1px solid #ddd" }}>
            {/* Avatar và Tên người dùng */}
            <div style={{ textAlign: "center", padding: "20px", marginTop: "25px" }}>
                <Avatar
                    size={80}
                    icon={<UserOutlined />}
                    src={AVT_URL + getUserById?.imageUrl}
                />
                <div className="mt-2 font-bold uppercase text-[1.2rem]">
                    {getUserById?.fullName}
                </div>
            </div>

            {/* Menu */}
            <Menu
                mode="inline"
                selectedKeys={[selectedMenu]}
                onClick={(e) => setSelectedMenu(e.key)}
                className="profile-menu"
                items={menuItems}
            />

        </Sider>
    );
};

export default SidebarMenu;
