import { Outlet } from "react-router-dom";
import HeaderComponent from "../components/header/HeaderComponent";
import { Layout } from "antd";
import { CartProvider } from "../components/CartProvider"
const BuyerLayout = () => {

    return (
        <CartProvider>
            <Layout style={{ minHeight: "100vh" }}>
                <HeaderComponent />
                <div className="layout-content">
                    <Outlet />
                </div>
            </Layout>
        </CartProvider>
    );
}

export default BuyerLayout;
