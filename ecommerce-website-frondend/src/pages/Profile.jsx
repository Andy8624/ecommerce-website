import { useState } from "react";
import { Layout } from "antd";
import SidebarMenu from "../features/profile/components/SidebarMenu";
import NotificationsSettings from "../features/profile/components/NotificationsSettings";
import PasswordChange from "../features/profile/components/PasswordChange";
import ProfileContent from "../features/profile/components/ProfileContent";
import AccountManagement from "../features/profile/components/AccountManagement";

const { Content } = Layout;

const Profile = () => {
    const [selectedMenu, setSelectedMenu] = useState("profile");

    const renderContent = () => {
        switch (selectedMenu) {
            case "profile":
                return <ProfileContent />;
            case "password":
                return <PasswordChange />;
            case "notifications":
                return <NotificationsSettings />;
            case "settings":
                return <AccountManagement />;
            default:
                return <div>Chọn một mục từ menu bên trái</div>;
        }
    };

    return (
        <Layout>
            <SidebarMenu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

            {/* Content */}
            <Layout>
                <Content className="bg-[#f5f5f5] my-3">
                    <div
                        style={{
                            maxWidth: "65rem",
                            margin: "0 auto",
                            background: "#fff",
                            padding: "2rem",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Profile;
