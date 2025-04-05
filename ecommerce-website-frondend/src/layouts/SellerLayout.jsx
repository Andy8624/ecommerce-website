import { Outlet, useLocation } from "react-router-dom"; // Add useLocation import
import SellerNavbar from "../components/SellerNavbar";
import { Layout } from "antd";
import { useState, useEffect } from "react"; // Add useEffect import
import TopHeaderSeller from "../components/header/TopHeaderSeller";

const SellerLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [currentNamePage, setCurrentNamePage] = useState("Trang chủ");
    const location = useLocation();

    useEffect(() => {
        // Check if current path is product-form
        if (location.pathname === "/seller/product-form") {
            setCurrentNamePage("Thêm sản phẩm");
        }
    }, [location.pathname]);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <SellerNavbar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                setCurrentNamePage={setCurrentNamePage}
            />
            <Layout style={{ marginLeft: collapsed ? 70 : 190 }}>
                <TopHeaderSeller
                    currentNamePage={currentNamePage}
                />
                <div className="px-5 py-4">
                    <Outlet />
                </div>
            </Layout>
        </Layout>
    );
};

export default SellerLayout;
