package com.dlk.ct466.service;

import com.dlk.ct466.domain.entity.Cart;
import com.dlk.ct466.domain.entity.Role;
import com.dlk.ct466.domain.entity.User;
import com.dlk.ct466.domain.mapper.CartMapper;
import com.dlk.ct466.domain.mapper.UserMapper;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.domain.response.cart.ResCartDTO;
import com.dlk.ct466.domain.response.user.ResCreateUserDTO;
import com.dlk.ct466.domain.response.user.ResUpdateUserDTO;
import com.dlk.ct466.domain.response.user.ResUserDTO;
import com.dlk.ct466.repository.UserRepository;
import com.dlk.ct466.util.PaginationUtil;
import com.dlk.ct466.util.error.IdInvalidException;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
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
        return UserMapper.mapToUserDTO(dbUser);
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
    public ResCreateUserDTO createUser(User user) throws IdInvalidException {
        Optional<User> dbUser = findUserByEmailAdmin(user.getEmail());
        if (dbUser.isPresent()) {
            throw new IdInvalidException("Email: '" + user.getEmail() + "' already exist");
        }

        String  hashPassword = this.passwordEncoder.encode(user.getPassword());
        user.setPassword(hashPassword);

        if (user.getRole() == null || user.getRole().getRoleId() == 0) {
            Role buyerRole = roleService.fetchById(3);
            user.setRole(buyerRole);
        } else {
            Role userRole = roleService.fetchById(user.getRole().getRoleId());
            user.setRole(userRole);
        }

        User newUser = userRepository.save(user);

        // tạo cart
        Cart newCart = new Cart();
        newCart.setUser(newUser);
        ResCartDTO cart = cartService.createCart(newCart);
        Cart cartUser = cartMapper.toCart(cart);
        user.setCart(cartUser);
        return userMapper.mapToCreateUserDTO(newUser);
    }

    public ResUpdateUserDTO updateUser(User user, String id) throws IdInvalidException {
        User dbUser = fetchUserById(id);
        dbUser.setFullName(user.getFullName());
        dbUser.setImageUrl(user.getImageUrl());
        dbUser.setActive(user.isActive());
        User updatedUser = userRepository.save(dbUser);
        return UserMapper.mapToUpdateUserDTO(updatedUser);
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
        return PaginationUtil.getPaginatedResult(pageUser, pageable, UserMapper::mapToUserDTO);
    }

    public ResPaginationDTO getAllUserAdmin(Pageable pageable) {
        Page<User> pageUser = userRepository.findAll(pageable);
        return PaginationUtil.getPaginatedResult(pageUser, pageable, UserMapper::mapToUserDTO);
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
        System.out.println(user);
        User dbUser = fetchUserById(user.getUserId());
        Role userRole = roleService.fetchById(user.getRole().getRoleId());
        dbUser.setRole(userRole);
        userRepository.save(dbUser);
        return null;
    }
}
