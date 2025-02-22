import { Layout } from "antd";
import TopHeaderSeller from "../components/header/TopHeaderSeller";
import { Outlet } from "react-router-dom";

export default function BecomeSellerLayout() {



    return (
        <Layout className="min-h-screen bg-gray-50">
            {/* Header */}
            <TopHeaderSeller
                title="Đăng ký trở thành Người bán EduMall"
            />

            {/* Main Content */}
            <Outlet />
        </Layout>
    );
}
