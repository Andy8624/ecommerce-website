import { Outlet, useNavigate } from "react-router-dom";
import HeaderComponent from "../components/header/HeaderComponent";
import { Layout } from "antd";
import CartProvider from "../components/CartProvider";
import TopHeader from "../components/header/TopHeader";
import { useDispatch } from "react-redux";
import { setLogoutUser } from "../redux/slices/accountSlice";
import { toast } from "react-toastify";
import { callLogout } from "../services/AuthService";

const BuyerLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        const old_access_token = localStorage.getItem('access_token');
        // xóa access token trong localStorage và cookies
        localStorage.removeItem('access_token');
        await callLogout({ old_access_token });
        dispatch(setLogoutUser({}));
        toast.success("Đăng xuất thành công!");
        navigate('/');
    };

    return (
        <CartProvider>
            <Layout>
                {/* Thanh menu trên cùng */}
                <TopHeader onLogout={handleLogout} />

                {/* Header chính */}
                <HeaderComponent onLogout={handleLogout} />

                {/* Nội dung chính */}
                <div className="pt-[110px]">
                    <Outlet />
                </div>
            </Layout>
        </CartProvider >
    );
};

export default BuyerLayout;
