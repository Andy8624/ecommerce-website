import { useEffect, useState } from "react";
import { connectWebSocket, disconnectWebSocket, sendMessage } from "../../../services/websocket-service";
import { getMessagesBetweenUsers } from "../../../services/message-service";
import { useSelector } from "react-redux";

const ChatPrivate = () => {
    const [messages, setMessages] = useState([]); // 📩 Danh sách tin nhắn
    const [messageText, setMessageText] = useState(""); // ✏️ Nội dung tin nhắn
    const [receiverId, setReceiverId] = useState(""); // 🔄 User nhận tin nhắn
    const [isConnected, setIsConnected] = useState(false);

    // 🏪 Lấy `userId` từ Redux (người dùng hiện tại)
    const userId = useSelector(state => state.account?.user?.id);

    // 📌 Kết nối WebSocket khi component mount
    useEffect(() => {
        if (userId && receiverId) {
            connectWebSocket(onMessageReceived, setIsConnected);
            loadChatHistory();
        }
        return () => {
            disconnectWebSocket(setIsConnected);
        };
    }, [userId, receiverId]); // 🔥 Khi `userId` hoặc `receiverId` thay đổi, tải lại lịch sử chat

    // 📌 Lấy lịch sử chat giữa user hiện tại & người nhận
    const loadChatHistory = async () => {
        if (!userId || !receiverId) return;
        const chatHistory = await getMessagesBetweenUsers(userId, receiverId);
        setMessages(chatHistory);
    };

    // 📌 Xử lý tin nhắn nhận được từ WebSocket
    const onMessageReceived = (message) => {
        console.log("📩 Tin nhắn nhận từ WebSocket:", message);
        setMessages((prevMessages) => [...prevMessages, message]); // ✅ Cập nhật danh sách tin nhắn ngay lập tức
    };

    // 📌 Gửi tin nhắn
    const handleSendMessage = () => {
        if (messageText.trim() === "" || !userId || !receiverId) return;

        const newMessage = {
            userIdFrom: userId,
            userIdTo: receiverId,
            text: messageText,
            createdAt: new Date().toISOString() // ✅ Thêm timestamp ngay khi gửi
        };

        sendMessage(userId, receiverId, messageText);
        setMessageText("");

        setMessages((prevMessages) => [...prevMessages, newMessage]); // ✅ Hiển thị tin nhắn ngay lập tức
    };

    return (
        <div style={{ maxWidth: "500px", margin: "20px auto", padding: "10px", border: "1px solid #ddd", borderRadius: "10px" }}>
            <h2>💬 Chat</h2>

            {/* 🔄 Nhập userId của người nhận */}
            <input
                type="text"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                placeholder="Nhập userId người nhận..."
                style={{ width: "100%", padding: "5px", marginBottom: "10px", border: "1px solid #ccc" }}
            />

            {/* 📩 Hiển thị tin nhắn */}
            <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", marginTop: "10px", padding: "5px" }}>
                {messages.map((msg, index) => {
                    const isCurrentUser = msg?.userIdFrom !== userId;
                    return (
                        <div key={index} style={{
                            textAlign: isCurrentUser ? "right" : "left",
                            marginBottom: "5px"
                        }}>
                            <strong>{isCurrentUser ? "Bạn" : "Đối phương"}:</strong> {msg.text}
                        </div>
                    );
                })}
            </div>

            {/* 📝 Ô nhập tin nhắn */}
            <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
                <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    style={{ flex: 1, padding: "5px" }}
                />
                <button onClick={handleSendMessage} disabled={!isConnected || !receiverId}>Gửi</button>
            </div>
        </div>
    );
};

export default ChatPrivate;
