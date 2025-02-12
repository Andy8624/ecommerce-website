package com.dlk.ecommerce.config;

import com.dlk.ecommerce.domain.response.RestResponse;
import com.dlk.ecommerce.service.AuthRedisService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

@Component
public class JwtBlacklistFilter extends OncePerRequestFilter {
    private final AuthRedisService authRedisService;
    private final ObjectMapper objectMapper;

    public JwtBlacklistFilter(AuthRedisService authRedisService, ObjectMapper objectMapper) {
        this.authRedisService = authRedisService;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String token = request.getHeader("Authorization");

        if (token != null && token.startsWith("Bearer ")) {
            token = token.replace("Bearer ", "");

            if (authRedisService.isBlacklisted(token)) {
                response.setContentType("application/json;charset=UTF-8");
                response.setStatus(HttpStatus.UNAUTHORIZED.value());

                // Gửi JSON phản hồi
                response.getWriter().write(objectMapper.writeValueAsString(
                        new RestResponse<>(
                                HttpStatus.UNAUTHORIZED.value(),
                                "Token is blacklisted",
                                "Token not valid... (In blacklist)",
                                token
                        )
                ));
                SecurityContextHolder.clearContext();
                return;
            }
        }

        chain.doFilter(request, response);
    }
}
