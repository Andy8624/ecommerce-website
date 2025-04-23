package com.dlk.ecommerce.service.Impl;

import com.dlk.ecommerce.service.AuthRedisService;
import com.dlk.ecommerce.service.BaseRedisService;
import com.dlk.ecommerce.util.SecurityUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthRedisServiceImpl implements AuthRedisService {
    BaseRedisService redisService;
    SecurityUtil securityUtil;

    private static final String ACCESS_TOKEN_BLACKLIST = "auth:token_blacklist:";
    private static final String LOGIN_SESSION_PREFIX = "auth:session:";
    private static final String LOGIN_HISTORY_PREFIX = "auth:login_history:";
    private static final int MAX_DEVICES = 3;

    private static final String PASSWORD_RESET_OTP_PREFIX = "auth:password_reset_otp:";
    private static final int OTP_EXPIRATION_SECONDS = 300; // 5 minutes

    @Override
    public void addToBlacklist(String token, long timeoutInSeconds) {
        redisService.set(ACCESS_TOKEN_BLACKLIST + token, "blacklisted");
        redisService.setTimeToLive(ACCESS_TOKEN_BLACKLIST + token, timeoutInSeconds);
//        log.info("🔴 Added token to blacklist: {}", redisService.get(ACCESS_TOKEN_BLACKLIST + token));
    }

    @Override
    public boolean isBlacklisted(String token) {
//        log.info("🔴 Check token in blacklist: {}", ACCESS_TOKEN_BLACKLIST + token);
        String JTI = securityUtil.getJtiFromToken(token);
        return redisService.hasKey(ACCESS_TOKEN_BLACKLIST + JTI);
    }


    private static final ObjectMapper objectMapper = new ObjectMapper();


    public void removeOldestSession(String userId) {
        String key = LOGIN_SESSION_PREFIX + userId;
        Map<String, Object> sessions = redisService.getFields(key);

        if (sessions == null || sessions.size() <= MAX_DEVICES) {
            return;
        }

        String oldestSessionId = null;
        long oldestTimestamp = Long.MAX_VALUE;

        for (Map.Entry<String, Object> entry : sessions.entrySet()) {
            try {
                JsonNode sessionNode = objectMapper.readTree(entry.getValue().toString());
                long timestamp = sessionNode.path("timestamp").asLong(Long.MAX_VALUE);

                if (timestamp < oldestTimestamp) {
                    oldestTimestamp = timestamp;
                    oldestSessionId = entry.getKey();
                }
            } catch (JsonProcessingException e) {
                log.error("Error parsing session JSON for sessionId {}: {}", entry.getKey(), e.getMessage());
            }
        }

        if (oldestSessionId != null) {
            deleteSession(userId, oldestSessionId);
        }
    }

    @Override
    public void saveLoginSession(String userId, String sessionId, String ip, String userAgent) {
        String key = LOGIN_SESSION_PREFIX + userId;
        saveLoginHistory(userId, ip, userAgent);

        // Tạo dữ liệu session mới
        Map<String, Object> sessionData = Map.of(
                "ip", ip,
                "userAgent", userAgent,
                "timestamp", System.currentTimeMillis()
        );

        try {
            // Convert Map thành JSON trước khi lưu vào Redis
            String sessionJson = objectMapper.writeValueAsString(sessionData);
            redisService.hashSet(key, sessionId, sessionJson);
            log.info("All sessions before: {}", redisService.getFields(key));

            // Xóa session cũ nhất nếu đã đạt giới hạn
            removeOldestSession(userId);

            log.info("🟢 All session after: {}", redisService.getFields(key));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting session data to JSON", e);
        }
    }

    @Override
    public boolean isValidSession(String userId, String JID) {
        String key = LOGIN_SESSION_PREFIX + userId;
        return redisService.hashExists(key, JID);
    }

    @Override
    public void deleteSession(String userId, String sessionId) {
        String key = LOGIN_SESSION_PREFIX + userId;
        redisService.deleteField(key, sessionId);
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

    @Override
    public void savePasswordResetOTP(String email, String otp) {
        String key = PASSWORD_RESET_OTP_PREFIX + email;
        redisService.set(key, otp);
        redisService.setTimeToLive(key, 300L);
        log.info("Saved OTP for {} with 5 minutes expiration OTP: {}", email, otp);
    }

    @Override
    public boolean validatePasswordResetOTP(String email, String otp) {
        String key = PASSWORD_RESET_OTP_PREFIX + email;
        String storedOTP = (String) redisService.get(key);

        // Check if OTP exists and matches
        if (storedOTP != null && storedOTP.equals(otp)) {
            // Delete the OTP after successful validation to prevent reuse
            redisService.delete(key);
            return true;
        }

        return false;
    }


}
