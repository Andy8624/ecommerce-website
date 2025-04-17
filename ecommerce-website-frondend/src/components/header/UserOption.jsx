import { Avatar, Badge, Button, Dropdown } from "antd";
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ChatButton from "../../features/chat/components/ChatButton";

const UserOptions = ({ navigate, cartQuantity, menu, image_url, AVT_URL }) => {

    return (
        <div className='flex items-center space-x-5'>
            {/* Nút chat */}
            <Button
                type="text"
                className="relative flex items-center justify-center p-0"
            >
                <ChatButton />
            </Button>

            {/* Giỏ hàng */}
            <Button
                type="text"
                className="relative flex items-center justify-center p-0"
                onClick={() => navigate("/cart")}
            >
                <Badge
                    count={cartQuantity}
                    offset={[0, 4]}
                    className="text-white text-xs font-bold rounded-full hover:scale-105"
                >
                    <div className="flex items-center justify-center w-10 h-10 bg-cyan-50 rounded-full transition-transform duration-300 hover:scale-105">
                        <ShoppingCartOutlined className="text-black text-xl" />
                    </div>
                </Badge>
            </Button>

            {/* Menu người dùng */}
            <Dropdown menu={menu} placement="bottomLeft" trigger={['click']}>
                <Avatar
                    icon={<UserOutlined />}
                    size={45}
                    className="cursor-pointer hover:scale-110"
                    src={AVT_URL + image_url}
                />
            </Dropdown>
        </div>
    );
};

export default UserOptions;