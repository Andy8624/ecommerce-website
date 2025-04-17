import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import axios from "../../../services/axios-customize";

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.connected = false;
        this.subscriptions = [];
        this.messageHandlers = new Map();
        this.errorHandlers = new Map();
        this.connectedHandlers = new Map();
        this.processedMessageIds = new Set();
        this.currentUser = null;
        this.handlerId = 0;
    }

    // Đăng ký handler cho tin nhắn đến
    registerMessageHandler(handler) {
        const id = ++this.handlerId;
        this.messageHandlers.set(id, handler);
        return id;
    }

    // Đăng ký handler cho sự kiện lỗi
    registerErrorHandler(handler) {
        const id = ++this.handlerId;
        this.errorHandlers.set(id, handler);
        return id;
    }

    // Đăng ký handler cho sự kiện kết nối thành công
    registerConnectedHandler(handler) {
        const id = ++this.handlerId;
        this.connectedHandlers.set(id, handler);
        return id;
    }

    // Hủy đăng ký handler
    unregisterHandler(id) {
        this.messageHandlers.delete(id);
        this.errorHandlers.delete(id);
        this.connectedHandlers.delete(id);
    }

    // Kiểm tra ID tin nhắn đã xử lý chưa
    isMessageProcessed(messageId) {
        if (!messageId) return false;
        return this.processedMessageIds.has(messageId);
    }

    // Đánh dấu tin nhắn đã xử lý
    markMessageAsProcessed(messageId) {
        if (!messageId) return;

        this.processedMessageIds.add(messageId);

        // Giới hạn kích thước của Set để tránh rò rỉ bộ nhớ
        if (this.processedMessageIds.size > 100) {
            const iterator = this.processedMessageIds.values();
            this.processedMessageIds.delete(iterator.next().value);
        }
    }

    // Kết nối WebSocket
    connect(currentUser) {
        if (!currentUser?.id || this.connected) return;

        this.currentUser = currentUser;

        const socket = new SockJS("http://localhost:8080/ws");
        const client = over(socket);

        // Tắt debug log
        client.debug = null;

        // Lưu client vào biến instance để có thể truy cập trong _onConnect
        this.stompClient = client;  // Thêm dòng này để lưu client vào this.stompClient ngay tại đây

        client.connect({}, this._onConnect.bind(this), this._onError.bind(this));

        return () => this.disconnect();
    }

    // Xử lý sự kiện kết nối thành công
    _onConnect() {
        console.log("WebSocket connected successfully!");
        this.connected = true;

        // Đăng ký với endpoint chính
        this._subscribeToUserQueue();

        // Thông báo cho tất cả handlers
        this.connectedHandlers.forEach(handler => handler(true));

        // Đăng ký người dùng khi kết nối thành công
        this._registerUser();

        // Lấy danh sách người dùng
        this.fetchUsers();
    }

    // Đăng ký với queue tin nhắn cá nhân
    _subscribeToUserQueue() {
        if (!this.currentUser?.id || !this.stompClient) return;

        const destination = `/user/${this.currentUser.id}/queue/messages`;
        console.log("Subscribing to:", destination);

        const subscription = this.stompClient.subscribe(destination, this._onMessageReceived.bind(this));
        this.subscriptions.push(subscription);

        // Subscribe thêm kênh public nếu cần
        const publicSubscription = this.stompClient.subscribe("/user/public", this._onMessageReceived.bind(this));
        this.subscriptions.push(publicSubscription);
    }

    // Đăng ký người dùng online
    _registerUser() {
        if (!this.currentUser?.id || !this.stompClient) return;

        this.stompClient.send("/app/user.addUser", {},
            JSON.stringify({
                nickName: this.currentUser.id,
                fullName: this.currentUser.fullName || this.currentUser.name,
                status: 'ONLINE'
            })
        );
    }

    // Xử lý tin nhắn nhận được
    _onMessageReceived(payload) {
        const payloadId = payload.headers?.['message-id'];

        // Kiểm tra tin nhắn đã xử lý
        if (this.isMessageProcessed(payloadId)) {
            console.log('Duplicate message detected, ignoring:', payloadId);
            return;
        }

        // Đánh dấu tin nhắn đã xử lý
        this.markMessageAsProcessed(payloadId);

        try {
            const notification = JSON.parse(payload.body);

            const message = {
                id: notification.id,
                senderId: notification.senderId,
                recipientId: notification.recipientId || this.currentUser.id,
                content: notification.content,
                timestamp: notification.timestamp ? new Date(notification.timestamp) : new Date()
            };

            // Thông báo cho tất cả handlers
            this.messageHandlers.forEach(handler => handler(message));
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }

    // Xử lý lỗi kết nối
    _onError(error) {
        console.error('WebSocket connection error:', error);
        this.connected = false;

        // Thông báo cho tất cả handlers
        this.errorHandlers.forEach(handler => handler(error));
    }

    // Ngắt kết nối WebSocket
    disconnect() {
        if (this.stompClient && this.connected) {
            // Hủy đăng ký người dùng
            this._unregisterUser();

            // Hủy đăng ký tất cả subscription
            this._unsubscribeAll();

            // Ngắt kết nối
            this.stompClient.disconnect();
            this.stompClient = null;
            this.connected = false;
        }
    }

    // Hủy đăng ký người dùng (offline)
    _unregisterUser() {
        if (!this.currentUser?.id || !this.stompClient) return;

        this.stompClient.send("/app/user.disconnectUser", {},
            JSON.stringify({
                nickName: this.currentUser.id,
                fullName: this.currentUser.fullName || this.currentUser.name,
                status: 'OFFLINE'
            })
        );
    }

    // Hủy đăng ký tất cả subscription
    _unsubscribeAll() {
        this.subscriptions.forEach(subscription => {
            try {
                subscription.unsubscribe();
            } catch (err) {
                console.error("Error unsubscribing:", err);
            }
        });
        this.subscriptions = [];
    }

    // Gửi tin nhắn
    sendMessage(recipientId, content) {
        if (!content.trim() || !this.stompClient || !recipientId || !this.currentUser?.id) {
            return { success: false, message: 'Invalid input or not connected' };
        }

        const chatMessage = {
            senderId: this.currentUser.id,
            recipientId: recipientId,
            content: content.trim(),
            timestamp: new Date()
        };

        try {
            // Tạo tin nhắn local để trả về cho UI
            const localMessage = {
                ...chatMessage,
                id: `local-${Date.now()}`
            };

            // Gửi qua WebSocket
            this.stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));

            return {
                success: true,
                message: 'Message sent successfully',
                localMessage
            };
        } catch (error) {
            console.error("Error sending message:", error);
            return { success: false, message: error.message };
        }
    }

    // Lấy danh sách người dùng có thể chat
    async fetchUsers() {
        try {
            const response = await axios.get(`/api/v1/users`);
            let users = response?.data?.result || response?.data || [];

            // Lọc bỏ người dùng hiện tại
            if (this.currentUser?.id) {
                users = users.filter(user => user.userId !== this.currentUser.id);
            }

            return { success: true, data: users };
        } catch (error) {
            console.error('Error fetching users:', error);
            return { success: false, message: error.message };
        }
    }

    // Lấy lịch sử tin nhắn giữa hai người dùng
    async fetchMessages(userId) {
        if (!this.currentUser?.id || !userId) {
            return { success: false, message: 'Missing user IDs' };
        }

        try {
            const response = await axios.get(`/api/v1/messages/${this.currentUser.id}/${userId}`);

            const chatHistory = Array.isArray(response?.data) ? response.data : [];
            const sortedChatHistory = [...chatHistory].sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
            });

            return { success: true, data: sortedChatHistory };
        } catch (error) {
            console.error('Error fetching messages:', error);
            return { success: false, message: error.message };
        }
    }

    // Thêm vào WebSocketService.js
    async fetchAllMessages() {
        if (!this.currentUser?.id) {
            return { success: false, message: 'Not authenticated' };
        }

        try {
            // Lấy danh sách ID người dùng đã chat
            const contactsResponse = await axios.get(`/api/v1/messages/contacts/userIds/${this.currentUser.id}`);
            const contactIds = contactsResponse?.data || [];

            if (!contactIds.length) {
                return { success: true, data: [] };
            }

            // Tạo object chứa tin nhắn của từng người dùng
            const allMessages = {};

            // Lặp qua từng liên hệ để lấy tin nhắn
            for (const contactId of contactIds) {
                const response = await axios.get(`/api/v1/messages/${this.currentUser.id}/${contactId}`);

                const chatHistory = Array.isArray(response?.data) ? response.data : [];
                const sortedChatHistory = [...chatHistory].sort((a, b) => {
                    return new Date(a.timestamp) - new Date(b.timestamp);
                });

                // Đếm số tin nhắn chưa đọc
                const unreadCount = chatHistory.filter(msg =>
                    msg.senderId === contactId && msg.status === 'DELIVERED'
                ).length;

                allMessages[contactId] = {
                    messages: sortedChatHistory,
                    unreadCount: unreadCount
                };
            }

            return { success: true, data: allMessages };
        } catch (error) {
            console.error('Error fetching all messages:', error);
            return { success: false, message: error.message };
        }
    }

    // Phương thức để kiểm tra xác thực
    isAuthenticated() {
        return !!this.currentUser?.id && this.connected;
    }

    // Kiểm tra xem tin nhắn đã tồn tại trong danh sách chưa
    isMessageExist(messages, newMessage) {
        return messages.some(msg =>
            msg.id === newMessage.id ||
            (msg.content === newMessage.content &&
                new Date(msg.timestamp).getTime() === new Date(newMessage.timestamp).getTime())
        );
    }

    // Thêm phương thức markMessagesAsRead
    markMessagesAsRead(recipientId) {
        if (this.stompClient && this.stompClient.connected && this.currentUser) {
            this.stompClient.send(
                '/app/mark-read',
                {},
                JSON.stringify({
                    senderId: this.currentUser.id,
                    recipientId: recipientId,
                })
            );
        }
    }
}

// Tạo singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;