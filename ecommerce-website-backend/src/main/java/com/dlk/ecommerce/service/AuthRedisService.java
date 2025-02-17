package com.dlk.ecommerce.service;

import java.util.List;

public interface AuthRedisService {
    void addToBlacklist(String token, long timeoutInSeconds);

    boolean isBlacklisted(String token);

    void saveLoginSession(String userId, String sessionId, String ip, String userAgent);

    boolean isValidSession(String userId, String JID);

    void deleteSession(String userId, String sessionId);

    int getActiveSessionCount(String userId);

    void saveLoginHistory(String userId, String ip, String userAgent);

    List<Object> getRecentLogins(String userId, int limit);
}
