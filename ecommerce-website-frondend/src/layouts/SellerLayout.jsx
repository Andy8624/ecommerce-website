import { Outlet } from "react-router-dom";
import SellerNavbar from "../components/SellerNavbar";
import { Layout } from "antd";
import { useState } from "react";
import TopHeaderSeller from "../components/header/TopHeaderSeller";

const SellerLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <SellerNavbar collapsed={collapsed} setCollapsed={setCollapsed} />
            <Layout style={{ marginLeft: collapsed ? 70 : 190 }}>
                <TopHeaderSeller

                />
                <div className="p-5">
                    <Outlet />
                </div>
            </Layout>
        </Layout >
    );
};

export default SellerLayout;
