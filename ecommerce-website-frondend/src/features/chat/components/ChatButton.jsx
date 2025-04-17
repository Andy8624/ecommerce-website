import { useState, useEffect, useMemo, useCallback } from 'react';
import { Badge, Drawer, Empty, Spin, Input } from 'antd';
import { MessageOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import useChat from '../hooks/useChat';
import UserItem from './UserItem';
import ChatWindow from './ChatWindow';

const MAX_CHAT_WINDOWS = 3; // Số lượng cửa sổ chat tối đa hiển thị cùng lúc

const ChatButton = () => {
    const currentUser = useSelector(state => state.account?.user);
    const [open, setOpen] = useState(false);

    // Quản lý các cửa sổ chat đang mở
    const [openedChats, setOpenedChats] = useState([]);

    // Thêm state cho tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

    // Sử dụng hook useChat để quản lý trạng thái chat
    const {
        connected,
        loading,
        users,
        allUserMessages,
        unreadMessages,
        selectUser,
        sendDirectMessage,
        markAsRead,
        loadAllMessages, // Đảm bảo hook useChat có hàm loadAllMessages
    } = useChat(currentUser);

    // Thiết lập một state riêng để theo dõi số lượng tin nhắn chưa đọc
    const [localUnreadMessages, setLocalUnreadMessages] = useState({});

    // Đồng bộ state localUnreadMessages với unreadMessages từ useChat
    useEffect(() => {
        setLocalUnreadMessages(unreadMessages);
    }, [unreadMessages]);

    // Tính tổng số tin nhắn chưa đọc từ localUnreadMessages
    const totalUnread = Object.values(localUnreadMessages).reduce((total, count) => total + count, 0);

    // QUAN TRỌNG: Khai báo hàm openChat sử dụng useCallback trước khi sử dụng trong useEffect
    // Cải tiến hàm openChat để kiểm tra trùng lặp tốt hơn
    const openChat = useCallback((user) => {
        // Kiểm tra user có tồn tại không
        if (!user || !user.userId) return;

        // Đảm bảo user có đầy đủ thông tin cần thiết
        const chatUser = {
            userId: user.userId,
            fullName: user.fullName || user.shopName || 'Người dùng',
            shopName: user.shopName || user.fullName,
            imageUrl: user.imageUrl || user.avatar || null,
            ...user // Giữ lại các thuộc tính khác
        };

        // Kiểm tra xem người dùng đã có cửa sổ chat mở chưa
        if (!openedChats.some(chat => chat.userId === user.userId)) {
            // Nếu đã đạt giới hạn số cửa sổ chat, loại bỏ cửa sổ cũ nhất
            if (openedChats.length >= MAX_CHAT_WINDOWS) {
                setOpenedChats(prev => [...prev.slice(1), chatUser]);
            } else {
                setOpenedChats(prev => [...prev, chatUser]);
            }
        } else {
            // Nếu đã mở, đưa lên đầu danh sách (vị trí gần nhất)
            setOpenedChats(prev => {
                const filteredChats = prev.filter(item => item.userId !== user.userId);
                return [...filteredChats, chatUser];
            });
        }

        // Đóng drawer danh sách
        setOpen(false);

        // Load tin nhắn của người dùng - chỉ cần gọi một lần
        selectUser(chatUser);

        return chatUser; // Trả về user để các hàm gọi có thể biết chat đã được mở
    }, [openedChats, selectUser]);

    // Lọc danh sách người dùng: chỉ hiển thị người dùng có lịch sử tin nhắn
    // và phù hợp với từ khóa tìm kiếm
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            // Chỉ lấy user đã có tin nhắn
            const hasMessages = allUserMessages[user.userId]?.length > 0;

            // Kiểm tra người dùng có phù hợp với từ khóa tìm kiếm
            const matchesSearch = !searchTerm ||
                (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.shopName?.toLowerCase().includes(searchTerm.toLowerCase()));

            // Chỉ hiển thị người dùng có lịch sử tin nhắn
            return hasMessages && matchesSearch;
        }).sort((a, b) => {
            // Ưu tiên các user có tin nhắn chưa đọc
            const unreadA = localUnreadMessages[a.userId] || 0;
            const unreadB = localUnreadMessages[b.userId] || 0;

            if (unreadA !== unreadB) {
                return unreadB - unreadA; // Sắp xếp theo số tin nhắn chưa đọc giảm dần
            }

            // Nếu cùng trạng thái, sắp xếp theo thời gian tin nhắn mới nhất
            const msgsA = allUserMessages[a.userId] || [];
            const msgsB = allUserMessages[b.userId] || [];

            const latestMsgTimeA = msgsA.length > 0 ? new Date(msgsA[msgsA.length - 1].timestamp || 0).getTime() : 0;
            const latestMsgTimeB = msgsB.length > 0 ? new Date(msgsB[msgsB.length - 1].timestamp || 0).getTime() : 0;

            return latestMsgTimeB - latestMsgTimeA; // Sắp xếp theo thời gian giảm dần
        });
    }, [users, allUserMessages, localUnreadMessages, searchTerm]);

    // Sửa useEffect cho sự kiện openChatDrawer
    useEffect(() => {
        const handleOpenChatDrawer = (event) => {
            const userId = event.detail;
            if (userId) {
                const user = users.find(u => u.userId === userId);
                if (user) {
                    openChat(user);
                }
            }
        };

        window.addEventListener('openChatDrawer', handleOpenChatDrawer);

        return () => {
            window.removeEventListener('openChatDrawer', handleOpenChatDrawer);
        };
    }, [users, openChat]);

    // Sửa useEffect cho sự kiện openChatWindow
    useEffect(() => {
        const handleOpenChatWindow = (event) => {
            const user = event.detail;
            if (user && user.userId) {
                // Tìm user trong danh sách và mở chat window
                // Nếu không tìm thấy, sẽ dùng thông tin từ sự kiện để tạo mới
                const existingUser = users.find(u => u.userId === user.userId);
                const chatUser = existingUser || user;

                // Nếu chat window đã mở (qua sự kiện khác), không mở thêm
                if (openedChats.some(chat => chat.userId === user.userId)) {
                    return;
                }

                // Mở chat window với user này
                openChat(chatUser);
            }
        };

        window.addEventListener('openChatWindow', handleOpenChatWindow);

        return () => {
            window.removeEventListener('openChatWindow', handleOpenChatWindow);
        };
    }, [users, openChat, openedChats]);

    // Theo dõi thay đổi kích thước màn hình
    useEffect(() => {
        const handleResize = () => {
            // Force re-render để tính toán lại vị trí cửa sổ chat
            setOpenedChats(prev => [...prev]);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Xử lý khi click vào nút chat để mở drawer
    const handleOpenChatDrawer = () => {
        // Load tất cả tin nhắn khi mở drawer
        loadAllMessages();
        setOpen(true);
    };

    // Đóng một cửa sổ chat
    const closeChat = (userId) => {
        setOpenedChats(prev => prev.filter(user => user.userId !== userId));
    };

    // Xử lý khi đóng drawer
    const handleClose = () => {
        setOpen(false);
        setSearchTerm('');
    };

    // Chuẩn bị dữ liệu tin nhắn cho một cuộc trò chuyện cụ thể
    const getMessagesForChat = (userId) => {
        return allUserMessages[userId] || [];
    };

    // Tính toán vị trí của các cửa sổ chat
    const calculateChatWindowPositions = () => {
        const windowWidth = window.innerWidth;
        const chatWindowWidth = 280; // Chiều rộng cố định của cửa sổ chat
        const spacing = 5; // Giảm khoảng cách xuống 5px
        const buttonWidth = 70; // Chiều rộng khoảng của button chat

        const positions = [];

        // Tính toán tổng chiều rộng cần thiết cho tất cả cửa sổ
        const totalNeededWidth = openedChats.length * chatWindowWidth +
            (openedChats.length - 1) * spacing +
            buttonWidth + spacing;

        // Số lượng cửa sổ tối đa có thể hiển thị dựa trên chiều rộng màn hình
        let maxVisibleWindows;

        if (totalNeededWidth > windowWidth) {
            maxVisibleWindows = Math.floor(
                (windowWidth - buttonWidth - spacing) / (chatWindowWidth + spacing)
            );
            maxVisibleWindows = Math.max(1, Math.min(maxVisibleWindows, MAX_CHAT_WINDOWS));
        } else {
            maxVisibleWindows = Math.min(openedChats.length, MAX_CHAT_WINDOWS);
        }

        // Vị trí bắt đầu từ phải qua trái
        for (let i = 0; i < maxVisibleWindows; i++) {
            positions.push({
                right: i * (chatWindowWidth + spacing) + spacing,
                zIndex: 40 - i
            });
        }

        return positions;
    };

    // Lấy danh sách cửa sổ chat hiển thị
    const visibleChats = () => {
        const positions = calculateChatWindowPositions();
        return openedChats.slice(-positions.length);
    };

    // Cập nhật hàm markAsRead để cập nhật cả state local
    const handleMarkAsRead = (userId) => {
        // Gọi hàm markAsRead từ useChat hook
        markAsRead(userId);

        // Cập nhật state local ngay lập tức
        setLocalUnreadMessages(prev => ({
            ...prev,
            [userId]: 0
        }));
    };

    return (
        <>
            {/* Nút chat trên header */}
            <Badge count={totalUnread} offset={[0, 4]}>
                <div className="flex items-center justify-center w-10 h-10 rounded-full hover:scale-105">
                    <MessageOutlined
                        className="text-black text-xl cursor-pointer hover:scale-105"
                        onClick={handleOpenChatDrawer}
                    />
                </div>
            </Badge>

            {/* Drawer danh sách chat */}
            <Drawer
                title={
                    <div className="flex items-center">
                        <span className="font-medium">Tin nhắn</span>
                    </div>
                }
                placement="right"
                onClose={handleClose}
                open={open}
                width={350}
                styles={{
                    body: { padding: 0, height: '100%' },
                    header: { padding: '12px 16px' }
                }}
            >
                {/* Thanh tìm kiếm */}
                <div className="px-4 py-2 border-b">
                    <Input
                        placeholder="Tìm kiếm tin nhắn"
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                    />
                </div>

                {/* Danh sách người dùng */}
                <div className="h-full overflow-auto" style={{ height: 'calc(100vh - 110px)' }}>
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Spin tip="Đang tải..." />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <Empty
                                description={
                                    searchTerm
                                        ? "Không tìm thấy kết quả"
                                        : "Bạn chưa có tin nhắn nào"
                                }
                            />
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => {
                                const userMessages = allUserMessages[user.userId] || [];
                                const latestMessage = userMessages.length > 0 ?
                                    userMessages[userMessages.length - 1] : null;

                                return (
                                    <UserItem
                                        key={user.userId}
                                        user={user}
                                        selected={false}
                                        unreadCount={localUnreadMessages[user.userId] || 0}
                                        latestMessage={latestMessage}
                                        currentUserId={currentUser?.id}
                                        onClick={() => openChat(user)}
                                        loading={false}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </Drawer>

            {/* Các cửa sổ chat riêng */}
            {visibleChats().map((user, index) => {
                const positions = calculateChatWindowPositions();

                return (
                    <div
                        key={user.userId}
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            right: `${positions[index].right}px`,
                            zIndex: positions[index].zIndex
                        }}
                    >
                        <ChatWindow
                            user={user}
                            onClose={closeChat}
                            messages={getMessagesForChat(user.userId)}
                            currentUser={currentUser}
                            unreadCount={localUnreadMessages[user.userId] || 0}
                            sendMessage={(content) => sendDirectMessage(content, user.userId)}
                            connected={connected}
                            markAsRead={handleMarkAsRead}
                        />
                    </div>
                );
            })}
        </>
    );
};

export default ChatButton;