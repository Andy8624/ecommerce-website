// Format thời gian tin nhắn
export const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Nếu là ngày hôm nay, chỉ hiển thị giờ
    if (messageDate >= today) {
        return messageDate.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    // Nếu là ngày hôm qua
    else if (messageDate >= yesterday) {
        return `Hôm qua, ${messageDate.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    }
    // Còn lại hiển thị ngày giờ đầy đủ
    else {
        return messageDate.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};