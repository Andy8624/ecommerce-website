import { useEffect, useRef } from 'react';
import { Spin } from 'antd';
import MessageItem from './MessageItem';

const MessageList = ({ messages, loading, currentUserId, formatMessageTime }) => {
    const chatAreaRef = useRef(null);

    // Cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div
            ref={chatAreaRef}
            className="flex-1 p-4 overflow-y-auto"
            style={{ height: 'calc(100% - 120px)' }}
        >
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <Spin size="large" tip="Đang tải tin nhắn..." />
                </div>
            ) : (
                Array.isArray(messages) && messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <MessageItem
                            key={msg.id || `msg-${index}`}
                            message={msg}
                            isCurrentUser={msg.senderId === currentUserId}
                            formatTime={formatMessageTime}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p>Hãy bắt đầu cuộc trò chuyện!</p>
                    </div>
                )
            )}
        </div>
    );
};

export default MessageList;