import { Avatar, Badge, Button, Dropdown } from "antd";
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const UserOptions = ({ navigate, cartQuantity, menu, user, AVT_URL }) => {
    return (
        <div className='flex items-center'>
            <Button
                type="text"
                className="relative flex items-center justify-center p-0 mr-5"
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

            <Dropdown menu={menu} placement="bottomLeft" trigger={['click', 'hover']}>
                <Avatar
                    icon={<UserOutlined />}
                    size={45}
                    className="cursor-pointer hover:scale-110"
                    src={AVT_URL + user?.imageUrl}
                    onClick={() => navigate('/profile')}
                />
            </Dropdown>
        </div>
    );
};

export default UserOptions;