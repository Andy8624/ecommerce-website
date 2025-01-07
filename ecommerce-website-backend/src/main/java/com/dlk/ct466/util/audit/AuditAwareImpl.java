package com.dlk.ct466.util.audit;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("auditAwareImpl")
public class AuditAwareImpl implements AuditorAware<String> {
    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Kiểm tra nếu Authentication là null hoặc chưa được xác thực
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }

        // Trả về tên của người dùng hiện tại
        return Optional.ofNullable(authentication.getName());
    }
}
