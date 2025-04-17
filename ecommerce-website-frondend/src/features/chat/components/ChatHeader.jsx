import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { AVT_URL } from '../../../utils/Config';

const ChatHeader = ({ selectedUser }) => {
    return (
        <div className="flex items-center p-4 bg-white border-b border-gray-200 shadow-sm">
            <Avatar
                icon={<UserOutlined />}
                className="bg-blue-400 mr-4"
                src={AVT_URL + selectedUser.imageUrl}
                size={40}
            />
            <span className="font-medium text-lg">{selectedUser.fullName}</span>
        </div>
    );
};

export default ChatHeader;