import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;

export const connectWebSocket = (onMessageReceived, setIsConnected) => {
    if (stompClient && stompClient.connected) return; // ✅ Tránh kết nối lại nhiều lần

    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        console.log("✅ WebSocket Connected");
        setIsConnected(true);

        // 📌 Nhận tin nhắn riêng tư
        stompClient.subscribe("/user/queue/private", (msg) => {
            const message = JSON.parse(msg.body);
            console.log("📩 Tin nhắn mới từ WebSocket:", message);
            onMessageReceived(message);
        });
    });
};

export const disconnectWebSocket = (setIsConnected) => {
    if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
            console.log("❌ WebSocket Disconnected");
            setIsConnected(false);
        });
        stompClient = null;
    }
};

export const sendMessage = (userIdFrom, userIdTo, text) => {
    if (stompClient && stompClient.connected) {
        const message = { userIdFrom, userIdTo, text };
        stompClient.send("/app/private-message", {}, JSON.stringify(message));
        console.log("📤 Tin nhắn đã gửi:", message);
    } else {
        console.warn("⚠️ WebSocket chưa kết nối!");
    }
};
