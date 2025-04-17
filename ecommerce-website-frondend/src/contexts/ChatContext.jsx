import { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import * as ChatService from '../services/ChatService';
import { API_BASE_URL } from '../utils/Config';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const currentUser = useSelector(state => state.account?.user);
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState({});

    // Kết nối WebSocket khi component được mount
    useEffect(() => {
        if (!currentUser?.id) return;

        const socket = new SockJS(`${API_BASE_URL}/ws`);
        const client = over(socket);
        client.debug = null; // Tắt debug log

        client.connect({}, () => {
            setStompClient(client);
            setConnected(true);

            // Đăng ký nhận tin nhắn cá nhân
            client.subscribe(`/user/${currentUser.id}/queue/messages`, onMessageReceived);

            // Đăng ký người dùng khi kết nối thành công
            client.send("/app/user.addUser", {},
                JSON.stringify({
                    nickName: currentUser.id,
                    fullName: currentUser.fullName || currentUser.name,
                    status: 'ONLINE'
                })
            );

            // Lấy danh sách người dùng đang online
            loadContacts();
        }, onError);

        return () => {
            if (client) {
                // Thông báo người dùng đã offline khi rời khỏi trang
                client.send("/app/user.disconnectUser", {},
                    JSON.stringify({
                        nickName: currentUser.id,
                        fullName: currentUser.fullName || currentUser.name,
                        status: 'OFFLINE'
                    })
                );
                client.disconnect();
                setConnected(false);
            }
        };
    }, [currentUser]);

    const onError = (error) => {
        console.error('WebSocket connection error:', error);
        setConnected(false);
    };

    // Xử lý khi nhận được tin nhắn mới
    const onMessageReceived = (payload) => {
        try {
            const message = JSON.parse(payload.body);
            console.log('Message received:', message);

            // Cập nhật danh sách liên hệ
            loadContacts();

            // Nếu đang chat với người gửi, thêm tin nhắn vào danh sách
            if (activeContact?.id === message.senderId) {
                setMessages(prev => [...prev, message]);
            } else {
                // Tăng số lượng tin nhắn chưa đọc
                setUnreadMessages(prev => ({
                    ...prev,
                    [message.senderId]: (prev[message.senderId] || 0) + 1
                }));

                // Hiển thị thông báo
                toast.info(`Tin nhắn mới từ ${message.senderName || 'người dùng'}`);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    };

    // Lấy danh sách liên hệ
    const loadContacts = async () => {
        if (!currentUser?.id) return;

        try {
            setLoading(true);
            const data = await ChatService.getContacts(currentUser.id);
            setContacts(data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error loading contacts:', error);
            toast.error("Không thể tải danh sách liên hệ.");
            setLoading(false);
        }
    };

    // Lấy lịch sử tin nhắn với người dùng đã chọn
    const loadMessages = async (contact) => {
        if (!currentUser?.id || !contact?.id) return;

        try {
            setLoading(true);
            setActiveContact(contact);

            const data = await ChatService.getChatMessages(currentUser.id, contact.id);
            setMessages(data || []);

            // Đánh dấu đã đọc tin nhắn
            setUnreadMessages(prev => ({
                ...prev,
                [contact.id]: 0
            }));

            setLoading(false);
        } catch (error) {
            console.error('Error loading messages:', error);
            toast.error("Không thể tải tin nhắn.");
            setLoading(false);
        }
    };

    // Gửi tin nhắn
    const sendMessage = async (content) => {
        if (!currentUser?.id || !activeContact?.id || !content.trim() || !stompClient || !connected) {
            return;
        }

        const messageObj = ChatService.createChatMessage(
            currentUser.id,
            activeContact.id,
            content.trim()
        );

        try {
            // Thêm tin nhắn vào danh sách (optimistic update)
            const tempMessage = {
                ...messageObj,
                id: `temp-${Date.now()}`
            };
            setMessages(prev => [...prev, tempMessage]);

            // Gửi tin nhắn qua WebSocket
            stompClient.send("/app/chat", {}, JSON.stringify(messageObj));
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error("Không thể gửi tin nhắn.");
        }
    };

    // Tính tổng số tin nhắn chưa đọc
    const totalUnread = Object.values(unreadMessages).reduce((sum, count) => sum + count, 0);

    return (
        <ChatContext.Provider
            value={{
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
            }}
        >
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