import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const MessageInput = ({ messageInput, setMessageInput, connected, sendMessage }) => {
    return (
        <form
            onSubmit={sendMessage}
            className="flex p-4 bg-white border-t border-gray-200"
        >
            <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                disabled={!connected}
                className="flex-1 mr-2"
            />
            <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={sendMessage}
                disabled={!connected || !messageInput.trim()}
            >
                Gửi
            </Button>
        </form>
    );
};

export default MessageInput;