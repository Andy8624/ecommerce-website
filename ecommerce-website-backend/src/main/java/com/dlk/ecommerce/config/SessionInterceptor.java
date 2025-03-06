package com.dlk.ecommerce.config;

import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.response.RestResponse;
import com.dlk.ecommerce.service.AuthRedisService;
import com.dlk.ecommerce.service.UserService;
import com.dlk.ecommerce.util.SecurityUtil;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@Slf4j
public class SessionInterceptor implements HandlerInterceptor {
    @Autowired
    private AuthRedisService authRedisService;
    @Autowired
    private SecurityUtil securityUtil;
    @Autowired
    private UserService userService;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Value("${dlk.jwt.access-token-validity-in-seconds}")
    private long accessTokenExpiration;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String requestURI = request.getRequestURI();
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String accessToken = authorizationHeader.substring(7);

            String email = SecurityUtil.getCurrentUserLogin().orElse(null);
            if (email == null) {
                return true; // Nếu không lấy được email, bỏ qua Interceptor
            }

            String userId = userService.findUserByEmail(email).getUserId();
            int sessionCount = authRedisService.getActiveSessionCount(userId);
//            log.info("🔹 Số lượng session: {}", sessionCount);
            if (sessionCount < 3) {
                return true; // Nếu chưa đủ 4 session thì bỏ qua Interceptor
            }

            // Lấy device_id từ header "device_id"
            String device_id = request.getHeader("device_id");
            if (!authRedisService.isValidSession(userId, device_id)) {
                log.info("🛑 Session không hợp lệ, chặn request: {}", requestURI);

                // Thêm token vào blacklist (dùng JTI để giảm độ dài của key)
                String JTI = securityUtil.getJtiFromToken(accessToken);
                authRedisService.addToBlacklist(JTI, accessTokenExpiration);

                // Thiết lập HTTP status code
                response.setContentType("application/json;charset=UTF-8");
                response.setStatus(409); // Đặt mã lỗi 409

                // Gửi JSON phản hồi
                response.getWriter().write(objectMapper.writeValueAsString(
                        new RestResponse<>(
                                409,
                                "Session is invalid",
                                "This session is invalid, please login again",
                                "Another session is active, please login again"
                        )
                ));
                return false; // Ngăn request tiếp tục xử lý
            }
        } else {
            return true;
        }

        return true;
    }



}
