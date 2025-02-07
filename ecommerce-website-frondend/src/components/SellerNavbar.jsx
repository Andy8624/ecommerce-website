import { Layout, Menu } from "antd";
import {
    HomeOutlined,
    ShopOutlined,
    OrderedListOutlined,
    BarChartOutlined,
    RollbackOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { TbLayoutSidebarLeftExpandFilled, TbLayoutSidebarRightExpand } from "react-icons/tb";

const { Sider } = Layout;

const SellerNavbar = ({ collapsed, setCollapsed }) => {
    const location = useLocation();

    const menuItems = [
        {
            key: "/seller",
            icon: <HomeOutlined style={{ fontSize: "20px" }} />,
            label: <Link to="/seller">Trang chủ</Link>,
        },
        {
            key: "/seller/products",
            icon: <ShopOutlined style={{ fontSize: "20px" }} />,
            label: <Link to="/seller/products">Sản phẩm</Link>,
        },
        {
            key: "/seller/orders",
            icon: <OrderedListOutlined style={{ fontSize: "20px" }} />,
            label: <Link to="/seller/orders">Đơn hàng</Link>,
        },
        {
            key: "/seller/statistics",
            icon: <BarChartOutlined style={{ fontSize: "20px" }} />,
            label: <Link to="/seller/statistics">Thống kê</Link>,
        },
        {
            key: "/",
            icon: <RollbackOutlined style={{ fontSize: "20px" }} />,
            label: <Link to="/">Trở về</Link>,
        },
    ];

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={200}
            style={{
                background: "#fff",
                borderRight: "1px solid #ddd",
                minHeight: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 1000,
            }}
            trigger={
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "50px",
                        backgroundColor: "#fff",
                        color: "white",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                    }}
                >
                    <span style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#000" }}>
                        {collapsed ? <TbLayoutSidebarLeftExpandFilled /> : <TbLayoutSidebarRightExpand />}
                    </span>
                </div>
            }

        >
            {/* Menu */}
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                className="profile-menu"
                items={menuItems}
            />
        </Sider>
    );
};

export default SellerNavbar;
