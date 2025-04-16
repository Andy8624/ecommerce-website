import { Outlet, useNavigate } from "react-router-dom";
import HeaderComponent from "../components/header/HeaderComponent";
import { Layout } from "antd";
import CartProvider from "../components/CartProvider";
import TopHeader from "../components/header/TopHeader";
import { useDispatch, useSelector } from "react-redux";
import { setLogoutUser } from "../redux/slices/accountSlice";
import { toast } from "react-toastify";
import { callLogout } from "../services/AuthService";
import ChatButton from "../features/chat/components/ChatButton";
import { ChatProvider } from "../contexts/ChatContext.jsx";

const BuyerLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.account?.user);

    const handleLogout = async () => {
        const old_access_token = localStorage.getItem('access_token');
        localStorage.removeItem('access_token');
        await callLogout({ old_access_token });
        dispatch(setLogoutUser({}));
        toast.success("Đăng xuất thành công!");
        navigate('/');
    };

    return (
        <CartProvider>
            <ChatProvider>
                <Layout>
                    {/* Thanh menu trên cùng */}
                    <TopHeader onLogout={handleLogout} />

                    {/* Header chính */}
                    <HeaderComponent onLogout={handleLogout} />

                    {/* Nội dung chính */}
                    <div className="pt-[110px]">
                        <Outlet />
                    </div>

                    {/* Chat button - hiển thị khi đã đăng nhập */}
                    {user?.id && <ChatButton />}
                </Layout>
            </ChatProvider>
        </CartProvider>
    );
};

export default BuyerLayout;
