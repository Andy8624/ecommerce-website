package com.dlk.ecommerce.service.Impl;

import com.dlk.ecommerce.service.AuthRedisService;
import com.dlk.ecommerce.service.BaseRedisService;
import com.dlk.ecommerce.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthRedisServiceImpl implements AuthRedisService {
    BaseRedisService<String, String, Object> redisService;
    UserService userService;

    private static final String BLACKLIST_PREFIX = "auth:token:";
    private static final String LOGIN_SESSION_PREFIX = "auth:session:";
    private static final String LOGIN_HISTORY_PREFIX = "auth:login_history:";
    private static final int MAX_DEVICES_BUYER = 3;
    private static final int MAX_DEVICES_SELLER = 1;

    public boolean isSeller(String userId) {
        return userService.getUserRole(userId).equals("SELLER");
    }

    @Override
    public void addToBlacklist(String token, long timeoutInSeconds) {
        redisService.set(BLACKLIST_PREFIX + token, "blacklisted");
        redisService.setTimeToLive(BLACKLIST_PREFIX + token, timeoutInSeconds);
    }

    @Override
    public boolean isBlacklisted(String token) {
        return redisService.hasKey(BLACKLIST_PREFIX + token);
    }

    @Override
    public void saveLoginSession(String userId, String sessionId, String ip, String userAgent) {
        String key = LOGIN_SESSION_PREFIX + userId;
        // Lấy ds session hiện có
        Map<String, Object> sessions = redisService.getFields(key);

        // Kiểm tra số lượng thiết bị đăng nhập
        int maxDevices = isSeller(userId) ? MAX_DEVICES_SELLER : MAX_DEVICES_BUYER;

        // Nếu số lượng session vượt quá giới hạn, xóa session cũ nhất
        if (sessions.size() >= maxDevices) {
            String oldestSessionId = sessions.keySet().iterator().next(); // Lấy session đầu tiên
            redisService.deleteField(key, oldestSessionId);
        }

        // Lưu session mới
        Map<String, Object> sessionData = Map.of(
                "sessionId", sessionId,
                "ip", ip,
                "userAgent", userAgent,
                "timestamp", System.currentTimeMillis()
        );
        redisService.hashSet(key, sessionId, sessionData);

        // Đặt TTL cho toàn bộ key (1 ngày)
        redisService.setTimeToLive(key, 24 * 60 * 60L);
    }

    @Override
    public int getActiveSessionCount(String userId) {
        String key = LOGIN_SESSION_PREFIX + userId;
        return redisService.getFields(key).size();
    }

    @Override
    public void saveLoginHistory(String userId, String ip, String userAgent) {
        String key = LOGIN_HISTORY_PREFIX + userId;

        // Tạo đối tượng lưu lịch sử đăng nhập
        String loginData = String.format("%s|%s|%d", ip, userAgent, System.currentTimeMillis());

        // Lưu vào danh sách Redis (LIFO - danh sách mới nhất trước)
        redisService.addToList(key, loginData);

        // Giữ tối đa 10 lần đăng nhập gần nhất
        redisService.trimList(key, 0, 9);
    }

    @Override
    public List<Object> getRecentLogins(String userId, int limit) {
        String key = LOGIN_HISTORY_PREFIX + userId;
        return redisService.getListRange(key, 0, limit - 1);
    }

}
