import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
    HomeOutlined,
    ShopOutlined,
    OrderedListOutlined,
    BarChartOutlined,
    BookOutlined,
    RollbackOutlined
} from "@ant-design/icons";

const { Sider } = Layout;

const SellerNavbar = ({ collapsed, setCollapsed }) => {
    const location = useLocation();

    const menuItems = [
        {
            key: "/seller",
            icon: <HomeOutlined />,
            label: <Link to="/seller">Trang chủ</Link>,
        },
        {
            key: "/seller/products",
            icon: <ShopOutlined />,
            label: <Link to="/seller/products">Sản phẩm</Link>,
        },
        {
            key: "/seller/courses",
            icon: <BookOutlined />,
            label: <Link to="/seller/courses">Khóa học</Link>,
        },
        {
            key: "/seller/orders",
            icon: <OrderedListOutlined />,
            label: <Link to="/seller/orders">Đơn hàng</Link>,
        },
        {
            key: "/seller/statistics",
            icon: <BarChartOutlined />,
            label: <Link to="/seller/statistics">Thống kê</Link>,
        },
        {
            key: "/",
            icon: <RollbackOutlined />,
            label: <Link to="/">Go back</Link>,
        },
    ];

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={200}
            style={{
                minHeight: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 1000,
                backgroundColor: "#164863",
            }}
        >
            <div
                className="logo mb-10"
                style={{
                    color: "white",
                    padding: "16px",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: collapsed ? "16px" : "20px",
                }}
            >
                {collapsed ? "SP" : "Seller Page"}
            </div>

            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                style={{
                    backgroundColor: "#164863",
                }}
                items={menuItems}
            />
        </Sider>
    );
};

export default SellerNavbar;
