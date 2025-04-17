import { List, Typography, Input } from 'antd';
import UserItem from './UserItem';

const { Title, Text } = Typography;
const { Search } = Input;

const UserList = ({ users, currentUser, selectedUser, unreadMessages, allUserMessages, loading, onSelectUser }) => {
    return (
        <div className="bg-white border-r border-gray-200 h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <Title level={4} className="mb-1">Chat</Title>
                <Text className="text-gray-500">Đang online: {currentUser?.shopName || currentUser?.fullName}</Text>
            </div>

            {/* Users list */}
            <div className="h-[calc(100%-60px)] flex flex-col">
                <Search placeholder="Tìm kiếm người dùng" className="p-2" />

                <List
                    loading={loading}
                    dataSource={users}
                    className="overflow-y-auto flex-1"
                    renderItem={user => {
                        // Lấy tin nhắn mới nhất từ người dùng này
                        const userMessages = allUserMessages[user.userId] || [];
                        const latestMessage = userMessages.length > 0 ?
                            userMessages[userMessages.length - 1] : null;

                        return (
                            <UserItem
                                key={user.userId}
                                user={user}
                                selected={selectedUser?.userId === user.userId}
                                unreadCount={unreadMessages[user.userId] || 0}
                                latestMessage={latestMessage}
                                currentUserId={currentUser.id}
                                onClick={() => onSelectUser(user)}
                            />
                        );
                    }}
                    locale={{ emptyText: 'Không có người dùng online' }}
                />
            </div>
        </div>
    );
};

export default UserList;