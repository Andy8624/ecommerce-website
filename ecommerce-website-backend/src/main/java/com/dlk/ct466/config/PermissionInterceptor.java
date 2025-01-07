package com.dlk.ct466.config;
import com.dlk.ct466.domain.entity.Role;
import com.dlk.ct466.domain.entity.User;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.domain.response.rolePermission.ResRoleOwnerDTO;
import com.dlk.ct466.service.RolePermissionService;
import com.dlk.ct466.service.RoleService;
import com.dlk.ct466.service.UserService;
import com.dlk.ct466.util.SecurityUtil;
import com.dlk.ct466.util.error.IdInvalidException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import java.util.List;

@Service
public class PermissionInterceptor implements HandlerInterceptor {
    @Autowired
    UserService userService;

    @Autowired
    RolePermissionService rolePermissionService;
    @Autowired
    private RoleService roleService;

    @Override
    @Transactional
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) throws Exception {
        String path = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);

        String requestURI = request.getRequestURI();
        String httpMethod = request.getMethod();
        System.out.println(">>> RUN preHandle");
        System.out.println(">>> path= " + path);
        System.out.println(">>> http Method " + httpMethod );
        System.out.println(">>> requestURI " + requestURI);

        String email = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";
        if (!email.isEmpty()) {
            User user = userService.findUserByEmail(email);

            if (user != null) {
                Role role = user.getRole();
                Long roleId = (role != null) ? role.getRoleId() : null;

                if (roleId == null) {
                    throw new IdInvalidException("Người dùng không có vai trò hợp lệ");
                }

                Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE);
                ResPaginationDTO paginationDTO = rolePermissionService.getPermissionsByRoleIdDTO(roleId, pageable);
                List<ResRoleOwnerDTO> resPermissionDTOList = (List<ResRoleOwnerDTO>) paginationDTO.getResult();

                boolean isAllow = resPermissionDTOList.stream().anyMatch(
                        item -> item.getPermission().getApiPath().equals(path) &&
                                item.getPermission().getMethod().equals(httpMethod)
                );

                if (!isAllow) {
                    throw new IdInvalidException("Người dùng không có quyền truy cập endpoint này");
                }


            }
        }
        return true;
    }
}
