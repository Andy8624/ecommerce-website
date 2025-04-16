import { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import websocketService from '../services/websocket-service';
import ChatService from '../services/ChatService';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useState(null);
    const [loading, setLoading] = useState(false);
    const [connected, setConnected] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState({});

    // Lấy thông tin người dùng hiện tại từ Redux store
    const currentUser = useSelector(state => state.account?.user);

    // Kết nối WebSocket khi người dùng đăng nhập
    useEffect(() => {
        if (!currentUser?.id) {
            return;
        }

        // Kết nối WebSocket
        websocketService
            .onConnect(() => {
                setConnected(true);
                console.log('WebSocket connected successfully');
                loadContacts();
            })
            .onError((error) => {
                console.error('WebSocket connection error:', error);
                toast.error('Không thể kết nối đến máy chủ chat.');
            })
            .onMessage((notification) => {
                handleNewMessage(notification);
            })
            .connect(currentUser.id)
            .catch(error => {
                console.error('Failed to connect to WebSocket:', error);
            });

        // Ngắt kết nối khi unmount
        return () => {
            websocketService.disconnect();
            setConnected(false);
        };
    }, [currentUser]);

    // Tải danh sách liên hệ
    const loadContacts = async () => {
        if (!currentUser?.id) return;

        try {
            setLoading(true);
            const fetchedContacts = await ChatService.getContacts(currentUser.id);
            setContacts(fetchedContacts);
        } catch (error) {
            console.error('Error loading contacts:', error);
            toast.error('Không thể tải danh sách liên hệ.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý khi nhận tin nhắn mới
    const handleNewMessage = (notification) => {
        // Nếu đang chat với người gửi, thêm tin nhắn vào danh sách
        if (activeContact?.id === notification.senderId) {
            setMessages(prevMessages => [...prevMessages, {
                id: notification.id,
                senderId: notification.senderId,
                recipientId: notification.recipientId,
                content: notification.content,
                timestamp: new Date()
            }]);
        } else {
            // Cập nhật số lượng tin nhắn chưa đọc
            setUnreadMessages(prev => ({
                ...prev,
                [notification.senderId]: (prev[notification.senderId] || 0) + 1
            }));

            // Hiển thị thông báo
            toast.info(`Tin nhắn mới từ ${notification.senderName || 'người dùng'}`);
        }
    };

    // Tải tin nhắn khi chọn một liên hệ
    const loadMessages = async (contact) => {
        if (!currentUser?.id || !contact?.id) return;

        try {
            setLoading(true);
            setActiveContact(contact);

            const fetchedMessages = await ChatService.getChatMessages(
                currentUser.id,
                contact.id
            );

            setMessages(fetchedMessages || []);

            // Đánh dấu tin nhắn đã đọc
            if (unreadMessages[contact.id]) {
                setUnreadMessages(prev => ({
                    ...prev,
                    [contact.id]: 0
                }));
            }
        } catch (error) {
            console.error('Error loading messages:', error);
            toast.error('Không thể tải tin nhắn.');
        } finally {
            setLoading(false);
        }
    };

    // Gửi tin nhắn mới
    const sendMessage = async (content) => {
        if (!currentUser?.id || !activeContact?.id || !content.trim() || !connected) {
            return;
        }

        const message = ChatService.createChatMessage(
            currentUser.id,
            activeContact.id,
            content.trim()
        );

        try {
            // Thêm tin nhắn vào UI trước (optimistic update)
            setMessages(prev => [...prev, message]);

            // Gửi tin nhắn qua WebSocket
            await websocketService.sendMessage(message);
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Không thể gửi tin nhắn.');
            // Có thể xóa tin nhắn khỏi UI nếu gửi không thành công
        }
    };

    // Tổng số tin nhắn chưa đọc
    const totalUnread = Object.values(unreadMessages).reduce((sum, count) => sum + count, 0);

    const contextValue = {
        messages,
        contacts,
        activeContact,
        loading,
        connected,
        unreadMessages,
        totalUnread,
        loadContacts,
        loadMessages,
        sendMessage,
        setActiveContact
    };

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};