import { useState, useRef, useEffect } from 'react';
import { Button, Avatar, Input } from 'antd';
import { UserOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons';
import { AVT_URL } from '../../../utils/Config';
import { formatMessageTime } from '../utils/messageUtils';

const ChatWindow = ({ user, onClose, messages, currentUser, unreadCount: propUnreadCount, sendMessage, connected, markAsRead }) => {
    const [messageInput, setMessageInput] = useState('');
    const [minimized, setMinimized] = useState(false);
    const messageRef = useRef(null);

    // Sử dụng local state để kiểm soát việc hiển thị trạng thái đã đọc
    const [localUnreadCount, setLocalUnreadCount] = useState(propUnreadCount);

    // Cập nhật localUnreadCount khi propUnreadCount thay đổi
    useEffect(() => {
        setLocalUnreadCount(propUnreadCount);
    }, [propUnreadCount]);

    // Scroll xuống dưới cùng khi có tin nhắn mới
    useEffect(() => {
        if (messageRef.current && !minimized) {
            messageRef.current.scrollTop = messageRef.current.scrollHeight;
        }
    }, [messages, minimized]);

    // Xử lý gửi tin nhắn
    const handleSendMessage = (e) => {
        e?.preventDefault();
        if (messageInput.trim()) {
            const messageSent = sendMessage(messageInput, user.userId);
            if (messageSent) {
                setMessageInput('');
            }
        }
    };

    // Xử lý nhấn Enter để gửi tin nhắn
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    // Toggle thu gọn/mở rộng chat window
    const toggleMinimize = () => {
        // Luôn đánh dấu đã đọc khi tương tác với cửa sổ chat
        handleMarkAsRead();
        setMinimized(!minimized);
    };

    // Function chung để đánh dấu đã đọc
    const handleMarkAsRead = () => {
        if (localUnreadCount > 0) {
            if (typeof markAsRead === 'function') {
                markAsRead(user.userId);
            }
            // Luôn cập nhật localUnreadCount ngay lập tức để UI thay đổi ngay
            setLocalUnreadCount(0);
        }
    };

    // Xử lý khi click vào header chat window
    const handleChatWindowClick = () => {
        handleMarkAsRead();
        toggleMinimize();
    };

    // Xác định các class dựa trên số lượng tin nhắn chưa đọc local
    const headerBgClass = localUnreadCount > 0 ? 'bg-blue-500' : 'bg-white';
    const headerTextClass = localUnreadCount > 0 ? 'text-white' : 'text-gray-800';
    const buttonTextClass = localUnreadCount > 0 ? 'text-white' : 'text-gray-800';

    return (
        <div className="shadow-lg rounded-t-lg bg-white flex flex-col w-[280px] mr-1">
            {/* Header */}
            <div
                className={`flex items-center justify-between ${headerBgClass} border-b ${headerTextClass} rounded-t-lg cursor-pointer p-2`}
                style={{
                    lineHeight: '1',
                }}
                onClick={handleChatWindowClick}
            >
                <div className="flex items-center ms-1">
                    <div className="relative">
                        <Avatar
                            src={AVT_URL + user?.imageUrl}
                            icon={<UserOutlined />}
                            className="mr-2"
                            size={30}
                        />
                    </div>
                    <span className={`font-bold truncate max-w-[10rem] text-sm`}>
                        {user.shopName || user.fullName}
                    </span>
                </div>
                <div>
                    <Button
                        type="text"
                        size="small"
                        icon={<CloseOutlined />}
                        className={`${buttonTextClass} mr-1 hover:opacity-80`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose(user.userId);
                        }}
                    />
                </div>
            </div>

            {/* Body - Hiển thị khi không thu nhỏ */}
            {!minimized && (
                <>
                    <div
                        ref={messageRef}
                        className="overflow-y-auto overflow-x-hidden ps-2 pe-2 h-[280px] pt-2"
                        onClick={handleMarkAsRead}
                    >
                        {messages && messages.length > 0 ? (
                            messages.map((msg) => (
                                <div
                                    key={msg.id || `temp-${Date.now()}-${Math.random()}`}
                                    className={`mb-3 flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className="max-w-[80%] w-auto">
                                        <div
                                            className={`rounded-lg p-2 ${msg.senderId === currentUser?.id
                                                ? 'bg-blue-500 text-white rounded-tr-none'
                                                : 'bg-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                                                }`}
                                            style={{
                                                lineHeight: "1.3",
                                                textAlign: 'left',
                                                wordWrap: 'break-word',
                                                overflowWrap: 'break-word',
                                                whiteSpace: 'pre-line'
                                            }}
                                        >
                                            {msg.content}
                                        </div>
                                        <div
                                            className={`text-xs text-gray-500 mt-1 
                                                ${msg.senderId === currentUser?.id ? 'text-right' : 'text-left'}`}
                                        >
                                            {msg.timestamp ? formatMessageTime(msg.timestamp) : 'Đang gửi...'}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                                Hãy bắt đầu cuộc trò chuyện
                            </div>
                        )}
                    </div>

                    {/* Input gửi tin nhắn */}
                    <div className="p-2 border-t border-gray-200 bg-white">
                        <form onSubmit={handleSendMessage} className="flex">
                            <Input
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={handleMarkAsRead}
                                placeholder="Nhập tin nhắn..."
                                disabled={!connected}
                                className="flex-1 rounded-full"
                                suffix={
                                    <SendOutlined
                                        onClick={handleSendMessage}
                                        className={`cursor-pointer ${messageInput.trim() && connected ? 'text-blue-500' : 'text-gray-300'}`}
                                    />
                                }
                            />
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatWindow;