import React, { useState, useEffect } from 'react';
import { Layout, List, Input, Avatar, Badge, Button, Divider, Empty, Spin } from 'antd';
import { SendOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TopHeader from '../../../components/header/TopHeader';
import HeaderComponent from '../../../components/header/HeaderComponent';

const { Header, Sider, Content } = Layout;

// Giả lập dữ liệu liên hệ cho demo
const DEMO_CONTACTS = [
  {
    id: '1',
    name: 'Shop Bút Mực Cao Cấp',
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1',
    lastMessage: 'Xin chào, tôi có thể giúp gì cho bạn?',
    timestamp: new Date(Date.now() - 25 * 60000),
    unread: 2,
  },
  {
    id: '2',
    name: 'Shop Điện thoại ABC',
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=2',
    lastMessage: 'Đơn hàng của bạn đã được giao',
    timestamp: new Date(Date.now() - 5 * 3600000),
    unread: 0,
  },
  {
    id: '3',
    name: 'Shop Quần áo XYZ',
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=3',
    lastMessage: 'Cảm ơn bạn đã mua hàng!',
    timestamp: new Date(Date.now() - 2 * 86400000),
    unread: 1,
  },
  {
    id: '4',
    name: 'Shop Giày dép 123',
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=4',
    lastMessage: 'Sản phẩm đã hết hàng, bạn có muốn đặt trước không?',
    timestamp: new Date(Date.now() - 4 * 86400000),
    unread: 0,
  },
];

const ChatPrivate = () => {
  const [contacts, setContacts] = useState(DEMO_CONTACTS);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector(state => state.account?.user);

  useEffect(() => {
    // Scroll to bottom on new messages
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  // Giả lập tải tin nhắn khi chọn liên hệ
  useEffect(() => {
    if (activeChat) {
      setLoading(true);
      setMessages([]);
      // Giả lập loading
      setTimeout(() => {
        // Tạo một số tin nhắn giả để demo
        const demoMessages = [];
        // Thêm 10-15 tin nhắn giả
        const messageCount = Math.floor(Math.random() * 6) + 10;
        
        for (let i = 0; i < messageCount; i++) {
          const isMe = i % 2 === 0;
          demoMessages.push({
            id: `msg-${i}`,
            sender: isMe ? 'me' : activeChat.id,
            content: isMe 
              ? ['Xin chào shop!', 'Tôi muốn hỏi về sản phẩm này', 'Sản phẩm này còn hàng không?', 'Cảm ơn shop!'][Math.floor(Math.random() * 4)]
              : ['Xin chào quý khách!', 'Dạ sản phẩm còn hàng ạ', 'Bạn muốn mua số lượng bao nhiêu?', 'Chúng tôi sẽ giao hàng trong 2-3 ngày'][Math.floor(Math.random() * 4)],
            timestamp: new Date(Date.now() - (messageCount - i) * 300000),
          });
        }
        
        setMessages(demoMessages);
        setLoading(false);
        
        // Cập nhật trạng thái đã đọc tin nhắn
        setContacts(prev => 
          prev.map(contact => 
            contact.id === activeChat.id 
              ? { ...contact, unread: 0 } 
              : contact
          )
        );
      }, 800);
    }
  }, [activeChat]);

  // Kiểm tra nếu chưa đăng nhập thì chuyển hướng
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  const handleSendMessage = () => {
    if (message.trim() && activeChat) {
      const newMessage = {
        id: Date.now().toString(),
        sender: 'me',
        content: message,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout className="min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopHeader />
        <HeaderComponent />
      </div>
      
      <Layout className="mt-[110px]">
        <Sider
          width={320}
          theme="light"
          style={{
            height: 'calc(100vh - 110px)',
            overflow: 'auto',
            position: 'fixed',
            left: 0,
            top: 110,
            bottom: 0,
            borderRight: '1px solid #f0f0f0',
          }}
        >
          <div className="p-4 bg-white border-b">
            <h2 className="text-lg font-semibold mb-0">Tin nhắn</h2>
          </div>
          <List
            dataSource={contacts}
            renderItem={(item) => (
              <List.Item
                className={`cursor-pointer hover:bg-gray-50 px-4 border-b ${
                  activeChat?.id === item.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setActiveChat(item)}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} size={48} />}
                  title={<span className="font-medium">{item.name}</span>}
                  description={
                    <span className="text-gray-500 text-sm line-clamp-1">
                      {item.lastMessage}
                    </span>
                  }
                />
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500 mb-1">
                    {formatDistanceToNow(item.timestamp, { locale: vi, addSuffix: true })}
                  </span>
                  {item.unread > 0 && (
                    <Badge count={item.unread} style={{ backgroundColor: '#ff4d4f' }} />
                  )}
                </div>
              </List.Item>
            )}
          />
        </Sider>
        
        <Layout style={{ marginLeft: 320 }}>
          <Content
            style={{
              height: 'calc(100vh - 110px)',
              overflow: 'hidden',
            }}
          >
            {activeChat ? (
              <div className="flex flex-col h-full">
                <Header
                  className="p-4 bg-white border-b flex items-center"
                  style={{ height: 'auto', lineHeight: '1.5', padding: '12px 16px' }}
                >
                  <Button
                    icon={<ArrowLeftOutlined />}
                    type="text"
                    className="mr-3 md:hidden"
                    onClick={() => setActiveChat(null)}
                  />
                  <Avatar src={activeChat.avatar} size={40} className="mr-3" />
                  <div>
                    <h3 className="font-medium m-0">{activeChat.name}</h3>
                    <span className="text-xs text-green-500">Online</span>
                  </div>
                </Header>
                
                <div
                  id="message-container"
                  className="flex-1 p-6 overflow-y-auto bg-gray-50"
                >
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <Spin tip="Đang tải tin nhắn..." />
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-6 max-w-[70%] ${
                          msg.sender === 'me' ? 'ml-auto' : 'mr-auto'
                        }`}
                      >
                        <div
                          className={`p-3 rounded-lg ${
                            msg.sender === 'me'
                              ? 'bg-blue-500 text-white rounded-tr-none'
                              : 'bg-white shadow-sm rounded-tl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <div
                          className={`text-xs mt-1 text-gray-500 ${
                            msg.sender === 'me' ? 'text-right' : ''
                          }`}
                        >
                          {formatDistanceToNow(msg.timestamp, {
                            locale: vi,
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-full text-gray-500">
                      <Empty description="Bắt đầu cuộc trò chuyện với cửa hàng" />
                    </div>
                  )}
                </div>
                
                <div className="p-3 border-t bg-white">
                  <Input.TextArea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    className="rounded-lg border-gray-300"
                    suffix={
                      <SendOutlined
                        onClick={handleSendMessage}
                        className={`cursor-pointer ${
                          message.trim() ? 'text-blue-500' : 'text-gray-300'
                        }`}
                      />
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-full bg-gray-50">
                <div className="text-center">
                  <h2 className="text-xl font-medium text-gray-700 mb-4">
                    Chọn một cuộc trò chuyện
                  </h2>
                  <p className="text-gray-500">
                    Chọn một shop để bắt đầu cuộc trò chuyện
                  </p>
                </div>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ChatPrivate;