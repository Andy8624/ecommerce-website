import { Layout, Menu, Avatar } from "antd";
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {
    UserOutlined,
    LockOutlined,
    BellOutlined,
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
        key: "settings",
        icon: <UserOutlined style={{ fontSize: "20px" }} />,
        label: "Cài Đặt Tài Khoản"
    },
    {
        key: "notifications",
        icon: <BellOutlined style={{ fontSize: "20px" }} />,
        label: "Cài Đặt Thông Báo"
    },

];

const SidebarMenu = ({ selectedMenu, setSelectedMenu }) => {
    const user = useSelector(state => state?.account?.user);
    const { getUserById } = useGetUserById(user?.id);
    console.log(getUserById)
    return (
        <Sider width={280} style={{ background: "#fff", borderRight: "1px solid #ddd" }}>
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
