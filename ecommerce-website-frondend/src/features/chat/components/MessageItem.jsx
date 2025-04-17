import { ClockCircleOutlined } from "@ant-design/icons";

const MessageItem = ({ message, isCurrentUser, formatTime }) => {

    const formatFullDate = (timestamp) => {
        if (!timestamp) return "Đang gửi...";

        const messageDate = new Date(timestamp);

        return messageDate.toLocaleString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div
            className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
        >
            <div className="max-w-[75%]">
                <div
                    className={`rounded-lg p-3 inline-block ${isCurrentUser
                        ? 'bg-blue-500 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                        }`}
                    style={{ maxWidth: '100%', wordBreak: 'break-word' }}
                >
                    {message.content}
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                    <span>{message.timestamp ? formatTime(message.timestamp) : 'Đang gửi...'}</span>

                    <span
                        className="ml-1 cursor-help"
                        title={formatFullDate(message.timestamp)}
                    >
                        <ClockCircleOutlined className="text-xs" />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MessageItem;