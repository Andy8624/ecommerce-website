import { Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCartContext } from '../../hooks/useCartContext';
import Logo from './Logo';
import { AVT_URL } from '../../utils/Config';
import AuthButton from './AuthButton';
import UserOptions from './UserOption';
import InputHeader from './InputHeader';
import { useGetUserById } from '../../hooks/useGetUserById';

const { Header } = Layout;
const HeaderComponent = ({ onLogout }) => {
    const navigate = useNavigate();
    const { cartQuantity } = useCartContext();
    const user = useSelector(state => state.account?.user);
    const permissions = user?.role?.permissions;
    const { getUserById } = useGetUserById(user?.id);

    const menu = {
        items:
            [
                {
                    key: '1',
                    label: <span className="block text-base px-1 py-1">Tài khoản của tôi</span>,
                    onClick: () => navigate('/profile'),
                },
                {
                    key: '2',
                    label: <span className="block text-base px-1 py-1">Đơn mua</span>,
                    onClick: () => navigate('/order-history'),
                },
                {
                    type: 'divider',
                },
                {
                    key: '3',
                    label: <span className="block text-base px-1 py-1">Đăng xuất</span>,
                    onClick: onLogout,
                },
            ]
    };




    return (
        <Header className="flex items-center justify-between pt-10 pb-5 px-[65px] h-[110px] shadow-md fixed-header" style={{ backgroundColor: "#8294C4" }}>
            <Logo />

            <InputHeader />

            {permissions?.length === 0 ? (
                <AuthButton navigate={navigate} />
            ) : (
                <UserOptions
                    navigate={navigate}
                    cartQuantity={cartQuantity}
                    menu={menu}
                    AVT_URL={AVT_URL}
                    image_url={getUserById?.imageUrl}
                />
            )}
        </Header>
    );
};

export default HeaderComponent;
