import { useState, useEffect, useCallback } from 'react';
import { message as antMessage } from 'antd';
import webSocketService from '../services/WebSocketService';

export const useChat = (currentUser) => {
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [allUserMessages, setAllUserMessages] = useState({});
    const [unreadMessages, setUnreadMessages] = useState({});

    // Đăng ký handlers khi component mount
    useEffect(() => {
        if (!currentUser?.id) return;

        // Khởi tạo kết nối
        const cleanupConnection = webSocketService.connect(currentUser);

        // Đăng ký handler khi kết nối thành công
        const connectedHandlerId = webSocketService.registerConnectedHandler((isConnected) => {
            setConnected(isConnected);

            if (isConnected) {
                loadUsers();
            }
        });

        // Đăng ký handler khi có lỗi
        const errorHandlerId = webSocketService.registerErrorHandler(() => {
            setConnected(false);
        });

        // Đăng ký handler khi có tin nhắn mới
        const messageHandlerId = webSocketService.registerMessageHandler((message) => {
            handleNewMessage(message);
        });

        // Cleanup khi unmount
        return () => {
            webSocketService.unregisterHandler(connectedHandlerId);
            webSocketService.unregisterHandler(errorHandlerId);
            webSocketService.unregisterHandler(messageHandlerId);
            if (cleanupConnection) cleanupConnection();
        };
    }, [currentUser]);

    // Load danh sách người dùng
    const loadUsers = useCallback(async () => {
        setLoading(true);
        const result = await webSocketService.fetchUsers();

        if (result.success) {
            setUsers(result.data);
        }

        setLoading(false);
    }, []);

    // Load tin nhắn giữa 2 người dùng
    const loadMessages = useCallback(async (userId) => {
        if (!userId) return;

        setLoading(true);
        const result = await webSocketService.fetchMessages(userId);

        if (result.success) {
            setMessages(result.data);

            // Cập nhật vào allUserMessages
            setAllUserMessages(prev => ({
                ...prev,
                [userId]: result.data
            }));

            // Đặt số tin nhắn chưa đọc về 0
            setUnreadMessages(prev => ({
                ...prev,
                [userId]: 0
            }));
        }

        setLoading(false);
    }, []);

    // Cập nhật hàm loadAllMessages trong useChat.js
    const loadAllMessages = useCallback(async () => {
        if (!currentUser || !webSocketService.isAuthenticated()) return;

        setLoading(true);
        try {
            // Gọi service để tải tất cả tin nhắn
            const result = await webSocketService.fetchAllMessages();

            if (result.success) {
                const allMessages = result.data;

                // Cập nhật state
                const newAllUserMessages = {};
                const newUnreadMessages = {};

                // Duyệt qua mỗi contact
                Object.keys(allMessages).forEach(userId => {
                    const conversation = allMessages[userId];
                    newAllUserMessages[userId] = conversation.messages || [];
                    newUnreadMessages[userId] = conversation.unreadCount || 0;
                });

                setAllUserMessages(newAllUserMessages);
                setUnreadMessages(newUnreadMessages);
            }
        } catch (error) {
            console.error('Error loading all messages:', error);
        } finally {
            setLoading(false);
        }
    }, [currentUser, webSocketService]);

    // Chọn người dùng để chat
    const selectUser = useCallback((user) => {
        setSelectedUser(user);
        if (user?.userId) {
            loadMessages(user.userId);
        }
    }, [loadMessages]);

    // Gửi tin nhắn
    const sendMessage = useCallback((messageContent) => {
        if (!selectedUser?.userId || !messageContent.trim()) return false;

        const result = webSocketService.sendMessage(selectedUser.userId, messageContent);

        if (result.success && result.localMessage) {
            // Cập nhật UI với tin nhắn local
            updateMessagesForUser(result.localMessage);
            return true;
        }

        return false;
    }, [selectedUser]);

    // Thêm hàm sendDirectMessage vào hook
    const sendDirectMessage = useCallback((content, recipientId) => {
        if (!content.trim() || !recipientId || !currentUser?.id) return false;

        try {
            // Tạo một tin nhắn tạm thời để hiển thị ngay lập tức
            const tempMessage = {
                id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                senderId: currentUser.id,
                recipientId: recipientId,
                content: content,
                timestamp: new Date()
            };

            // Cập nhật UI với tin nhắn tạm thời
            setAllUserMessages(prev => {
                const prevMessages = prev[recipientId] || [];
                return {
                    ...prev,
                    [recipientId]: [...prevMessages, tempMessage]
                };
            });

            // Gửi tin nhắn qua WebSocket
            webSocketService.sendMessage(recipientId, content);

            return true;
        } catch (error) {
            console.error("Error sending direct message:", error);
            return false;
        }
    }, [currentUser]);

    // Thêm hàm để đánh dấu tin nhắn đã đọc
    const markAsRead = useCallback((userId) => {
        if (!userId) return;

        // Cập nhật unread messages
        setUnreadMessages(prev => ({
            ...prev,
            [userId]: 0
        }));

        // Gọi API để cập nhật trạng thái đã đọc trên server
        webSocketService.markMessagesAsRead(userId);
    }, []);

    // Xử lý khi nhận được tin nhắn mới
    const handleNewMessage = useCallback((message) => {
        // Cập nhật tin nhắn cho người gửi
        updateMessagesForUser(message);

        // Xử lý thông báo và badge
        const isActiveUser = selectedUser?.userId === message.senderId;
        const isCurrentUser = message.senderId === currentUser.id;
        const isSentByCurrentUserToActive = isCurrentUser && selectedUser?.userId === message.recipientId;

        if (isActiveUser) {
            // Đang chat với người gửi, đặt số tin nhắn chưa đọc về 0
            setUnreadMessages(prev => ({
                ...prev,
                [message.senderId]: 0
            }));
        } else if (isSentByCurrentUserToActive) {
            // Tin nhắn được gửi bởi người dùng hiện tại đến người đang chat
            // Không cần làm gì thêm
        } else {
            // Tin nhắn từ người không phải là người đang chat hiện tại
            // Kiểm tra xem có đang ở trang của người gửi không
            const isCurrentPageOfSender = window.location.pathname.includes(`/user/${message.senderId}`);

            if (!isCurrentPageOfSender && !isCurrentUser) {
                // Tăng số tin nhắn chưa đọc
                setUnreadMessages(prev => ({
                    ...prev,
                    [message.senderId]: (prev[message.senderId] || 0) + 1
                }));

                // Hiển thị thông báo
                const sender = users.find(u => u.userId === message.senderId);
                if (sender) {
                    antMessage.info({
                        content: `Tin nhắn mới từ ${sender.fullName}: ${message.content.substring(0, 30)}${message.content.length > 30 ? '...' : ''}`,
                        duration: 3,
                        onClick: () => selectUser(sender),
                        key: `msg-${Date.now()}`
                    });
                }
            }
        }

        // Cập nhật danh sách người dùng sau khi nhận tin nhắn
        loadUsers();
    }, [currentUser, selectedUser, users, selectUser, loadUsers]);

    // Cập nhật tin nhắn cho người dùng
    const updateMessagesForUser = useCallback((message) => {
        // Cập nhật tin nhắn trong allUserMessages
        setAllUserMessages(prev => {
            // Xác định key để lưu tin nhắn (senderId nếu là tin nhắn đến, recipientId nếu là tin nhắn đi)
            const userId = message.senderId !== currentUser.id ? message.senderId : message.recipientId;
            const prevMessages = prev[userId] || [];

            // Kiểm tra tin nhắn đã tồn tại chưa
            const messageExists = webSocketService.isMessageExist(prevMessages, message);

            if (messageExists) {
                return prev;
            }

            // Thêm tin nhắn mới và sắp xếp lại
            const updatedMessages = [...prevMessages, message].sort((a, b) =>
                new Date(a.timestamp) - new Date(b.timestamp)
            );

            return {
                ...prev,
                [userId]: updatedMessages
            };
        });

        // Cập nhật messages hiện tại nếu đang chat với người liên quan
        const isChatWithSender = selectedUser?.userId === message.senderId;
        const isChatWithRecipient = selectedUser?.userId === message.recipientId && currentUser.id === message.senderId;

        if (isChatWithSender || isChatWithRecipient) {
            setMessages(prev => {
                // Kiểm tra tin nhắn đã tồn tại trong messages chưa
                const messageExists = webSocketService.isMessageExist(prev, message);

                if (messageExists) {
                    return prev;
                }

                // Thêm tin nhắn mới và sắp xếp lại
                return [...prev, message].sort((a, b) =>
                    new Date(a.timestamp) - new Date(b.timestamp)
                );
            });
        }
    }, [currentUser, selectedUser]);

    return {
        connected,
        loading,
        users,
        selectedUser,
        messages,
        allUserMessages,
        unreadMessages,
        setUnreadMessages,
        selectUser,
        sendMessage,
        sendDirectMessage,  // Thêm hàm mới
        markAsRead, // Thêm hàm mới vào
        loadUsers,
        loadMessages,
        loadAllMessages // Thêm hàm này vào return
    };
};

export default useChat;