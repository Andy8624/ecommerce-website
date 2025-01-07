package com.dlk.ct466.service;

import com.dlk.ct466.domain.entity.Cart;
import com.dlk.ct466.domain.entity.User;
import com.dlk.ct466.domain.mapper.CartMapper;
import com.dlk.ct466.domain.response.cart.ResCartDTO;
import com.dlk.ct466.repository.CartRepository;
import com.dlk.ct466.repository.UserRepository;
import com.dlk.ct466.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    public ResCartDTO getCartById(String id) throws IdInvalidException {
        Cart dbCart = cartRepository.findById(id).orElseThrow(
                () -> new IdInvalidException("Cart with id: " + id + " not found")
        );
        return cartMapper.toCartDTO(dbCart);
    }

    @Transactional
    public ResCartDTO createCart(Cart cart) throws IdInvalidException {
        if (cart.getUser() == null || cart.getUser().getUserId() == null) {
            throw new IdInvalidException("User cannot be null or empty");
        }

        String userId = cart.getUser().getUserId();

        // Kiểm tra nếu đã tồn tại Cart cho userId
        if (cartRepository.existsByUserUserId(userId)) {
            throw new IdInvalidException("User with id: " + userId + " already has a cart");
        }
        User user = userRepository.findById(cart.getUser().getUserId())
                .orElseThrow(() -> new IdInvalidException("User with id: " + cart.getUser().getUserId() + " not found"));

        cart.setUser(user);
        Cart newCart = cartRepository.save(cart);
        return cartMapper.toCartDTO(newCart);
    }

//    public Cart updateCart(Cart cart, String id) throws IdInvalidException {
//        Cart dbCart = getCartById(id);
//
//        if (cart.getUser() != null && cart.getUser().getUserId() != null) {
//            User user = userRepository.findById(cart.getUser().getUserId())
//                    .orElseThrow(() -> new IdInvalidException("User with id: " + cart.getUser().getUserId() + " not found"));
//            dbCart.setUser(user);
//        } else {
//            throw new IdInvalidException("User cannot be null or empty");
//        }
//
//        return cartRepository.save(dbCart);
//    }

    public ResCartDTO getCartByUserId(String userId) throws IdInvalidException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IdInvalidException("User with id: " + userId + " not found"));

        Cart dbCart = cartRepository.findByUserUserId(user.getUserId()).orElseThrow(
                () -> new IdInvalidException("Cart for user id: " + userId + " not found")
        );
        return cartMapper.toCartDTO(dbCart);
    }
}
