package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.Address;
import com.dlk.ecommerce.domain.entity.Cart;
import com.dlk.ecommerce.domain.entity.Role;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.mapper.CartMapper;
import com.dlk.ecommerce.domain.mapper.UserMapper;
import com.dlk.ecommerce.domain.request.user.ReqCreateShop;
import com.dlk.ecommerce.domain.request.user.ReqCreateUser;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.domain.response.cart.ResCartDTO;
import com.dlk.ecommerce.domain.response.user.ResCreateUserDTO;
import com.dlk.ecommerce.domain.response.user.ResUpdateUserDTO;
import com.dlk.ecommerce.domain.response.user.ResUserDTO;
import com.dlk.ecommerce.repository.UserRepository;
import com.dlk.ecommerce.util.PaginationUtil;
import com.dlk.ecommerce.util.SecurityUtil;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;
    private final RoleService roleService;
    private final UserMapper userMapper;
    private final CartService cartService;
    private final CartMapper cartMapper;

    public User fetchUserById(String id) throws IdInvalidException {
        return userRepository.findByIdIfNotDeleted(id).orElseThrow(
                () -> new IdInvalidException("User with id: '" + id + "' not found")
        );
    }

    public ResUserDTO getUserByIdDTO(String id) throws IdInvalidException {
        User dbUser = userRepository.findByIdIfNotDeleted(id).orElseThrow(
                () -> new IdInvalidException("User with id: '" + id + "' not found")
        );
        return userMapper.mapToUserDTO(dbUser);
    }

    public User fetchUserByIdAdmin(String id) throws IdInvalidException {
        return userRepository.findByUserId(id).orElseThrow(
                () -> new IdInvalidException("User with id: '" + id + "' not found")
        );
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmailNotDeleted(email).orElse(null);
    }

    // tìm cả những tài khoản đã xóa và đã hủy kích hoạt
    public Optional<User> findUserByEmailAdmin(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional
    public ResCreateUserDTO createUser(ReqCreateUser request) throws IdInvalidException {
        Optional<User> dbUser = findUserByEmailAdmin(request.getEmail());
        if (dbUser.isPresent()) {
            throw new IdInvalidException("Email: '" + request.getEmail() + "' already exist");
        }

        String  hashPassword = this.passwordEncoder.encode(request.getPassword());
        request.setPassword(hashPassword);

        if (request.getRole() == null || request.getRole().getRoleId() == 0) {
            Role buyerRole = roleService.fetchById(3);
            request.setRole(buyerRole);
        } else {
            Role userRole = roleService.fetchById(request.getRole().getRoleId());
            request.setRole(userRole);
        }

        User newUser = userRepository.save(userMapper.toUser(request));

        // tạo cart
        Cart newCart = new Cart();
        newCart.setUser(newUser);
        ResCartDTO cart = cartService.createCart(newCart);
        Cart cartUser = cartMapper.toCart(cart);
        newUser.setCart(cartUser);
        return userMapper.mapToCreateUserDTO(newUser);
    }

    public ResUpdateUserDTO updateUser(User user, String id) throws IdInvalidException {
        User dbUser = fetchUserById(id);
        if (user.getFullName() != null) {
            dbUser.setFullName(user.getFullName());
        }
        if (user.getImageUrl() != null) {
            dbUser.setImageUrl(user.getImageUrl());
        }
        if (user.getPhone() != null) {
            dbUser.setPhone(user.getPhone());
        }
        if (user.getBirthdate() != null) {
            dbUser.setBirthdate(user.getBirthdate());
        }
        if (user.getGender() != null) {
            dbUser.setGender(user.getGender());
        }
        dbUser.setActive(user.isActive());
        User updatedUser = userRepository.save(dbUser);
        return userMapper.mapToUpdateUserDTO(updatedUser);
    }

    public Void deleteUser(String id) throws IdInvalidException {
        User dbUser = fetchUserById(id).toBuilder()
                .deleted(true)
                .build();
        userRepository.save(dbUser);
        return null;
    }

    public Void restoreUser(String id) throws IdInvalidException {
        User dbUser = fetchUserByIdAdmin(id).toBuilder()
                .deleted(false)
                .build();
        userRepository.save(dbUser);
        return null;
    }

    public ResPaginationDTO getAllUser(Pageable pageable) {
        FilterNode node = filterParser.parse("deleted=false");
        FilterSpecification<User> spec = filterSpecificationConverter.convert(node);

        Page<User> pageUser = userRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageUser, pageable, userMapper::mapToUserDTO);
    }

    public ResPaginationDTO getAllUserAdmin(Pageable pageable) {
        Page<User> pageUser = userRepository.findAll(pageable);
        return PaginationUtil.getPaginatedResult(pageUser, pageable, userMapper::mapToUserDTO);
    }

    public void updateUserToken(String refreshToken, String email) {
        User dbUser = findUserByEmail(email);
        if (dbUser != null) {
            dbUser.setRefreshToken(refreshToken);
            userRepository.save(dbUser);
        }
    }

    public Optional<User> getUserByRefreshTokenAndEmail(String refreshToken, String email) {
        return userRepository.findByRefreshTokenAndEmail(refreshToken, email);
    }


    public Void updateUserRole(User user) throws IdInvalidException {
        User dbUser = fetchUserById(user.getUserId());
        Role userRole = roleService.fetchById(user.getRole().getRoleId());
        dbUser.setRole(userRole);
        dbUser.setShopId(user.getShopId());
        userRepository.save(dbUser);
        return null;
    }

    public User updateUserTaxNumber(User user, String userId) throws IdInvalidException {
        User dbUser = fetchUserById(userId);
        dbUser.setTaxNumber(user.getTaxNumber());
        userRepository.save(dbUser);
        return null;
    }

    public Boolean checkPhoneExists(String phone, String userId) {
        User dbUser = userRepository.findByUserId(userId).orElse(null);
        // Nếu số điện thoại có tồn tại thì phải xem xét xem số điện thoại đó có thuộc về user hiện tại không
        if (userRepository.existsByPhone(phone)) {
            if (dbUser != null) {
                return !dbUser.getPhone().equals(phone);
            }
            return true;
        }
        return false;
    }

    public Boolean checkShopNameExists(String shopname) {
        return userRepository.existsByShopName(shopname);
    }

    public String getShopId() {
        String userEmail =  SecurityUtil.getCurrentUserLogin().get();
        User dbUser = findUserByEmail(userEmail);
        return dbUser.getShopId();
    }

    public ResUpdateUserDTO partialUpdateUser(String id, ResUpdateUserDTO reqUpdateUser) throws IdInvalidException {
        User dbUser = fetchUserById(id);
        // Sử dụng MapStruct để cập nhật một phần
        userMapper.partialUpdate(dbUser, reqUpdateUser);
        return userMapper.mapToUpdateUserDTO(userRepository.save(dbUser));
    }

    public Map<String, Object> updateShippingMethod(
            String userId, Map<String,
            Object> shippingMethod
    ) throws IdInvalidException {
        User user = fetchUserById(userId);
        user.setShippingMethodFromMap(shippingMethod);
        userRepository.save(user);
        return user.getShippingMethodAsMap();
    }

    public Map<String, Object> getShippingMethodService(String userId) throws IdInvalidException {
        User user = fetchUserById(userId);
        return user.getShippingMethodAsMap();
    }
}
