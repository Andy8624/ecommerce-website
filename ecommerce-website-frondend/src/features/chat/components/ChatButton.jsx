import { useState, useRef, useEffect } from 'react';
import { Button, Badge, Drawer, List, Input, Avatar, Empty, Spin } from 'antd';
import { MessageOutlined, SendOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../../contexts/ChatContext';
import { API_BASE_URL } from '../../../utils/Config';

const ChatButton = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const messageRef = useRef(null);
    const navigate = useNavigate();

    const {
        messages,
        contacts,
        activeContact,
        loading,
        totalUnread,
        sendMessage: sendChatMessage,
        loadMessages,
        setActiveContact
    } = useChat();

    // Scroll to bottom of messages
    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollTop = messageRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        // Hàm xử lý sự kiện mở chat drawer
        const handleOpenChatDrawer = (event) => {
            const contact = event.detail;
            if (contact) {
                setOpen(true);
                loadMessages(contact);
            }
        };

        // Đăng ký lắng nghe sự kiện
        window.addEventListener('openChatDrawer', handleOpenChatDrawer);

        // Xóa lắng nghe khi component unmount
        return () => {
            window.removeEventListener('openChatDrawer', handleOpenChatDrawer);
        };
    }, [loadMessages]);

    useEffect(() => {
        console.log("Contacts:", contacts);
        console.log("Active Contact:", activeContact);
        console.log("Messages:", messages);
    }, [contacts, activeContact, messages]);

    const handleSendMessage = () => {
        if (message.trim() && activeContact) {
            sendChatMessage(message);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const showFullChat = () => {
        navigate('/chat');
        setOpen(false);
    };

    return (
        <>
            <div className="fixed bottom-8 right-8 z-50">
                <Badge count={totalUnread} size="large" offset={[-5, 5]}>
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<MessageOutlined style={{ fontSize: '24px' }} />}
                        size="large"
                        onClick={() => setOpen(true)}
                        className="shadow-lg bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
                        style={{ width: 56, height: 56 }}
                    />
                </Badge>
            </div>

            <Drawer
                title={
                    activeContact ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center" onClick={() => setActiveContact(null)}>
                                <>
                                    <Button
                                        type="text"
                                        icon={<CloseOutlined />}
                                        size="small"
                                        className="mr-2"
                                    />
                                    <Avatar
                                        src={`${API_BASE_URL}${activeContact.imageUrl}`}
                                        className="mr-2"
                                        icon={<UserOutlined />}
                                    />
                                    <span className="font-medium">{activeContact.fullName || 'User'}</span>
                                </>
                            </div>
                            <Button type="link" onClick={showFullChat}>
                                Xem đầy đủ
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Tin nhắn</span>
                            <Button type="link" onClick={showFullChat}>
                                Xem tất cả
                            </Button>
                        </div>
                    )
                }
                placement="right"
                onClose={() => {
                    setOpen(false);
                    setActiveContact(null);
                }}
                open={open}
                width={380}
                bodyStyle={{ padding: 0, height: '100%' }}
                headerStyle={{ padding: '12px 16px' }}
            >
                {!activeContact ? (
                    <List
                        loading={loading}
                        dataSource={contacts}
                        renderItem={(contact) => (
                            <List.Item
                                className="cursor-pointer hover:bg-gray-50 px-4"
                                onClick={() => loadMessages(contact)}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            src={contact.imageUrl ? `${API_BASE_URL}${contact.imageUrl}` : null}
                                            icon={<UserOutlined />}
                                        />
                                    }
                                    title={<span className="font-medium">{contact.fullName || 'User'}</span>}
                                    description={
                                        <span className="text-gray-500 text-sm line-clamp-1">
                                            {contact.lastMessage || 'Bắt đầu cuộc trò chuyện'}
                                        </span>
                                    }
                                />
                            </List.Item>
                        )}
                        className="overflow-auto"
                        style={{ height: 'calc(100vh - 55px)' }}
                        locale={{ emptyText: <Empty description="Không có liên hệ" /> }}
                    />
                ) : (
                    <div className="flex flex-col h-full">
                        <div
                            ref={messageRef}
                            className="flex-1 p-4 overflow-y-auto"
                            style={{ height: 'calc(100vh - 120px)' }}
                        >
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <Spin tip="Đang tải tin nhắn..." />
                                </div>
                            ) : messages.length > 0 ? (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id || `temp-${Date.now()}-${Math.random()}`}
                                        className={`mb-4 max-w-[80%] ${msg.senderId === activeContact.id ? '' : 'ml-auto'
                                            }`}
                                    >
                                        <div
                                            className={`p-3 rounded-lg ${msg.senderId === activeContact.id
                                                ? 'bg-gray-100'
                                                : 'bg-blue-500 text-white'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                        <div
                                            className={`text-xs mt-1 text-gray-500 ${msg.senderId === activeContact.id ? '' : 'text-right'
                                                }`}
                                        >
                                            {formatDistanceToNow(new Date(msg.timestamp), {
                                                locale: vi,
                                                addSuffix: true,
                                            })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <Empty description="Hãy bắt đầu cuộc trò chuyện" />
                                </div>
                            )}
                        </div>
                        <div className="p-3 border-t">
                            <div className="flex">
                                <Input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Nhập tin nhắn..."
                                    className="mr-2 rounded-full px-4 border-gray-300"
                                    suffix={
                                        <SendOutlined
                                            onClick={handleSendMessage}
                                            className={`cursor-pointer ${message.trim() ? 'text-blue-500' : 'text-gray-300'
                                                }`}
                                        />
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>
        </>
    );
};

export default ChatButton;