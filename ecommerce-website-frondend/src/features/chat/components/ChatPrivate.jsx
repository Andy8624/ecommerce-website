import { useState } from 'react';
import { Layout, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { formatMessageTime } from '../utils/messageUtils';
import UserList from './UserList';
import MessageList from './MessageList';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import useChat from '../hooks/useChat';

const { Content, Sider } = Layout;
const { Title } = Typography;

const ChatPrivate = () => {
  const currentUser = useSelector(state => state.account?.user);
  const [messageInput, setMessageInput] = useState('');

  const {
    connected,
    loading,
    users,
    selectedUser,
    messages,
    allUserMessages,
    unreadMessages,
    selectUser,
    sendMessage: sendMessageToBackend
  } = useChat(currentUser);

  // Hàm gửi tin nhắn
  const handleSendMessage = (e) => {
    e?.preventDefault();

    const messageSent = sendMessageToBackend(messageInput);

    if (messageSent) {
      setMessageInput('');
    }
  };

  return (
    <Layout className="flex h-screen">
      <Sider width={300} className="bg-white">
        <UserList
          users={users}
          currentUser={currentUser}
          selectedUser={selectedUser}
          unreadMessages={unreadMessages}
          allUserMessages={allUserMessages}
          loading={loading}
          onSelectUser={selectUser}
        />
      </Sider>

      <Content className="flex flex-col h-full bg-gray-50">
        {selectedUser ? (
          <>
            <ChatHeader selectedUser={selectedUser} />

            <MessageList
              messages={messages}
              loading={loading}
              currentUserId={currentUser?.id}
              formatMessageTime={formatMessageTime}
            />

            <MessageInput
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              connected={connected}
              sendMessage={handleSendMessage}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <Title level={3} className="text-gray-600">Chọn một người dùng để bắt đầu chat</Title>
            </div>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default ChatPrivate;