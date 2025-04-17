package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.ChatMessage;
import com.dlk.ecommerce.domain.entity.ChatRoom;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.repository.ChatMessageRepository;
import com.dlk.ecommerce.repository.ChatRoomRepository;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.dlk.ecommerce.util.helper.LogFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final UserService userService;
    private final ChatRoomService chatRoomService;
    private final ChatRoomRepository chatRoomRepository;

    // Lưu tin nhắn vô DB
    public ChatMessage save(ChatMessage chatMessage) {
        // Tạo chatID nếu chưa có
        String chatId = chatRoomService.getChatRoomID(
                chatMessage.getSenderId(),
                chatMessage.getRecipientId(),
                true
        ).orElseThrow(() -> new RuntimeException("Can not get chat room ID"));

        chatMessage.setChatId(chatId);
        chatMessageRepository.save(chatMessage);
        return chatMessage;
    }

    // Lấy danh sách tin nhắn giữa 2 người
    public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
        var chatId = chatRoomService.getChatRoomID(senderId, recipientId,false);
        return chatId.map(chatMessageRepository::findByChatId).orElse(new ArrayList<>());
    }

    public List<Map<String, Object>> findUserContacts(String userId) throws IdInvalidException {
        // 1. Tìm tất cả các phòng chat mà người dùng này tham gia
        List<ChatRoom> chatRooms = chatRoomRepository.findAllBySenderId(userId);

        // 2. Tạo danh sách kết quả
        List<Map<String, Object>> result = new ArrayList<>();

        // 3. Xử lý từng phòng chat
        for (ChatRoom room : chatRooms) {
            String recipientId = room.getRecipientId();

            // Bỏ qua nếu recipient là chính mình
            if (recipientId.equals(userId)) continue;

            // Tìm thông tin người nhận
            User recipient = userService.fetchUserById(recipientId);
            if (recipient == null) continue;

            // Tìm tin nhắn gần nhất trong phòng chat này
            Optional<ChatMessage> lastMessage =
                    chatMessageRepository.findFirstByChatIdOrderByTimestampDesc(room.getChatId());

            // Tạo đối tượng thông tin liên hệ
            Map<String, Object> contactInfo = new HashMap<>();
            contactInfo.put("id", recipient.getUserId());
            contactInfo.put("fullName", recipient.getFullName());
            contactInfo.put("imageUrl", recipient.getImageUrl());

            // Thêm thông tin shop nếu có
            if (recipient.getShopName() != null) {
                contactInfo.put("shopName", recipient.getShopName());
            }

            // Thêm thông tin tin nhắn gần nhất nếu có
            lastMessage.ifPresent(message -> {
                contactInfo.put("lastMessage", message.getContent());
                contactInfo.put("lastMessageTime", message.getTimestamp());
                // Xác định xem tin nhắn này là của ai gửi
                contactInfo.put("isLastMessageMine", message.getSenderId().equals(userId));
            });

            result.add(contactInfo);
        }

        // 4. Sắp xếp theo thời gian tin nhắn gần nhất (nếu có)
        result.sort((c1, c2) -> {
            Date time1 = (Date) c1.getOrDefault("lastMessageTime", new Date(0));
            Date time2 = (Date) c2.getOrDefault("lastMessageTime", new Date(0));
            return time2.compareTo(time1); // Sắp xếp giảm dần (mới nhất lên đầu)
        });

        return result;
    }

    public List<String> findUserContactIds(String userId) {
        // Tìm tất cả các phòng chat mà người dùng này tham gia (là người gửi hoặc người nhận)
        List<ChatRoom> chatRooms = chatRoomRepository.findAllBySenderIdOrRecipientId(userId, userId);

        // Tạo danh sách kết quả
        Set<String> contactIds = new HashSet<>();

        // Xử lý từng phòng chat
        for (ChatRoom room : chatRooms) {
            // Nếu người dùng là người gửi, thêm người nhận vào danh sách liên hệ
            if (room.getSenderId().equals(userId) && !room.getRecipientId().equals(userId)) {
                contactIds.add(room.getRecipientId());
            }

            // Nếu người dùng là người nhận, thêm người gửi vào danh sách liên hệ
            if (room.getRecipientId().equals(userId) && !room.getSenderId().equals(userId)) {
                contactIds.add(room.getSenderId());
            }
        }

        return new ArrayList<>(contactIds);
    }
}