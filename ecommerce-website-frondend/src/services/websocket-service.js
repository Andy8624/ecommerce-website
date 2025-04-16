import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { API_BASE_URL } from '../utils/Config';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.onConnectCallback = null;
        this.onErrorCallback = null;
        this.messageCallbacks = new Map();
        this.connected = false;
    }

    connect(userId) {
        if (this.connected) return Promise.resolve();

        return new Promise((resolve, reject) => {
            const socket = new SockJS(`${API_BASE_URL}/ws`);

            this.stompClient = new Client({
                webSocketFactory: () => socket,
                debug: (str) => {
                    console.log("WebSocket debug:", str);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: (frame) => {
                    console.log("Connected to WebSocket:", frame);
                    this.connected = true;

                    // Subscribe to personal messages
                    this.stompClient.subscribe(`/user/${userId}/queue/messages`, (message) => {
                        try {
                            const notification = JSON.parse(message.body);
                            console.log("Received message:", notification);

                            // Call all registered callbacks for this message type
                            const callbacks = this.messageCallbacks.get('message') || [];
                            callbacks.forEach(callback => callback(notification));
                        } catch (error) {
                            console.error("Error processing message:", error);
                        }
                    });

                    if (this.onConnectCallback) {
                        this.onConnectCallback(frame);
                    }

                    resolve(frame);
                },
                onStompError: (frame) => {
                    console.error("WebSocket STOMP error:", frame);
                    this.connected = false;

                    if (this.onErrorCallback) {
                        this.onErrorCallback(frame);
                    }

                    reject(frame);
                },
                onWebSocketClose: () => {
                    console.log("WebSocket connection closed");
                    this.connected = false;
                },
                onWebSocketError: (event) => {
                    console.error("WebSocket error:", event);
                    this.connected = false;
                }
            });

            // Activate the connection
            this.stompClient.activate();
        });
    }

    disconnect() {
        return new Promise((resolve) => {
            if (this.stompClient && this.connected) {
                this.stompClient.deactivate().then(() => {
                    console.log("Disconnected from WebSocket");
                    this.connected = false;
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    sendMessage(message) {
        if (!this.stompClient || !this.connected) {
            console.error("STOMP client not connected");
            return Promise.reject(new Error("WebSocket not connected"));
        }

        return new Promise((resolve, reject) => {
            try {
                this.stompClient.publish({
                    destination: "/app/chat",
                    body: JSON.stringify(message),
                    headers: { "content-type": "application/json" }
                });
                resolve();
            } catch (error) {
                console.error("Error sending message:", error);
                reject(error);
            }
        });
    }

    onConnect(callback) {
        this.onConnectCallback = callback;
        return this;
    }

    onError(callback) {
        this.onErrorCallback = callback;
        return this;
    }

    onMessage(callback) {
        if (!this.messageCallbacks.has('message')) {
            this.messageCallbacks.set('message', []);
        }
        this.messageCallbacks.get('message').push(callback);
        return this;
    }

    isConnected() {
        return this.connected;
    }
}

// Singleton instance
const websocketService = new WebSocketService();
export default websocketService;