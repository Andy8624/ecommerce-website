import { Avatar, Badge } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { AVT_URL } from '../../../utils/Config';
import { formatMessageTime } from '../utils/messageUtils';

const UserItem = ({
    user,
    selected,
    unreadCount,
    latestMessage,
    currentUserId,
    onClick,
}) => {
    // Rút gọn nội dung tin nhắn nếu quá dài
    const getShortMessageContent = (content) => {
        if (!content) return '';
        return content.length > 35 ? `${content.substring(0, 35)}...` : content;
    };

    // Hiển thị thời gian tin nhắn theo định dạng phù hợp
    const getTimeDisplay = (timestamp) => {
        if (!timestamp) return '';

        const msgDate = new Date(timestamp);
        const now = new Date();

        // Nếu là hôm nay, hiển thị giờ:phút
        if (msgDate.toDateString() === now.toDateString()) {
            return formatMessageTime(timestamp);
        }

        // Nếu là tuần này, hiển thị thứ
        const diff = Math.floor((now - msgDate) / (1000 * 60 * 60 * 24));
        if (diff < 7) {
            const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            return days[msgDate.getDay()];
        }

        // Khác thì hiển thị dd/mm
        return `${msgDate.getDate()}/${msgDate.getMonth() + 1}`;
    };

    return (
        <div
            className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors
                ${selected ? 'bg-blue-50' : ''}
                ${unreadCount > 0 ? 'bg-blue-50 font-semibold' : ''}`}
            onClick={onClick}
        >
            <div className="relative">
                <Badge dot={unreadCount > 0} offset={[-2, 2]} color="blue">
                    <Avatar
                        src={AVT_URL + user?.imageUrl}
                        icon={<UserOutlined />}
                        size={48}
                        className="mr-3"
                    />
                </Badge>
            </div>

            <div className="flex-grow min-w-0 pr-2">
                <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900 truncate max-w-[170px]">
                        {user.shopName || user.fullName}
                    </div>
                    {latestMessage && (
                        <div className="text-xs text-gray-500">
                            {getTimeDisplay(latestMessage.timestamp)}
                        </div>
                    )}
                </div>

                <div className="flex mt-1">
                    <div className={`text-sm truncate max-w-[200px] ${unreadCount > 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                        {latestMessage ? (
                            latestMessage.senderId === currentUserId ? (
                                <span className="text-gray-500">Bạn: {getShortMessageContent(latestMessage.content)}</span>
                            ) : (
                                getShortMessageContent(latestMessage.content)
                            )
                        ) : (
                            <span className="text-gray-400 italic">Bắt đầu trò chuyện</span>
                        )}
                    </div>

                    {unreadCount > 0 && (
                        <div className="ml-auto">
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserItem;