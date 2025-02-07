import { Avatar, Badge, Dropdown } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { BellOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";
import { AVT_URL } from "../../utils/Config";
import { useGetUserById } from '../../hooks/useGetUserById';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TopHeaderSeller = ({ title, onLogout }) => {
    const userId = useSelector(state => state.account?.user?.id);
    const { getUserById } = useGetUserById(userId);
    const navigate = useNavigate();

    // Menu items
    const menu = {
        items: [
            {
                key: '1',
                label: <span className="block text-base px-3 py-1">Trở về trang mua hàng</span>,
                onClick: () => navigate('/profile'),
            },
            {
                key: '2',
                label: <span className="block text-base px-3 py-1 text-red-500">Đăng xuất</span>,
                onClick: onLogout,
            },
        ],
    };

    return (
        <Header className="bg-white shadow-md flex justify-between items-center px-6">
            <div className="text-blue-400 font-semibold text-lg">
                {title}
            </div>
            <div className="flex items-center gap-4">
                {/* Badge thông báo */}
                <Badge count={1} offset={[-5, 5]} className="text-xs font-medium">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-300 hover:scale-105">
                        <BellOutlined className="text-2xl text-gray-600 cursor-pointer" />
                    </div>
                </Badge>

                {/* Badge tin nhắn */}
                <Badge count={1} offset={[-5, 5]} className="text-xs font-medium">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-300 hover:scale-105">
                        <MessageOutlined className="text-2xl text-gray-600 cursor-pointer" />
                    </div>
                </Badge>

                {/* Khung chứa Avatar & Email với Dropdown */}
                <Dropdown menu={menu} trigger={['click']} placement="bottomRight">
                    <div className="flex items-center gap-2 rounded-lg border border-2 p-2 cursor-pointer 
                        hover:bg-gray-100 transition duration-200">
                        <span className="me-2 text-gray-600 font-semibold text-sm">{getUserById?.email}</span>
                        <Avatar size={36} icon={<UserOutlined />} src={AVT_URL + getUserById?.imageUrl} />
                    </div>
                </Dropdown>
            </div>
        </Header>
    );
}

export default TopHeaderSeller;
