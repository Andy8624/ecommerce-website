package com.dlk.ct466.service;

import com.dlk.ct466.domain.entity.Cart;
import com.dlk.ct466.domain.entity.CartTool;
import com.dlk.ct466.domain.entity.Tool;
import com.dlk.ct466.domain.mapper.CartMapper;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.domain.response.cart.ResCartDTO;
import com.dlk.ct466.repository.CartToolRepository;
import com.dlk.ct466.repository.ToolRepository;
import com.dlk.ct466.util.PaginationUtil;
import com.dlk.ct466.util.error.IdInvalidException;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartToolService {
    private final CartToolRepository cartToolRepository;
    private final ToolRepository toolRepository;
    private final CartService cartService;
    private final CartMapper cartMapper;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;

    public CartTool getCartToolById(long id) throws IdInvalidException {
        return cartToolRepository.findById(id).orElseThrow(
                () -> new IdInvalidException("CartTool with id: " + id + " not found"));
    }

    @Transactional
    public CartTool createCartTool(CartTool cartTool) throws IdInvalidException {
        if (cartTool.getCart() == null || cartTool.getCart().getCartId() == null) {
            throw new IdInvalidException("Cart ID cannot be null");
        }

        ResCartDTO cartDTO = cartService.getCartById(cartTool.getCart().getCartId());
        Cart cart = cartMapper.toCart(cartDTO);
        cartTool.setCart(cart);

        if (cartTool.getTool() == null || cartTool.getTool().getToolId() == 0) {
            throw new IdInvalidException("Tool ID cannot be null or zero");
        }

        Tool tool = toolRepository.findById(cartTool.getTool().getToolId())
                .orElseThrow(() -> new IdInvalidException("Tool with id: " + cartTool.getTool().getToolId() + " not found"));
        cartTool.setTool(tool);

        // Sử dụng phương thức tìm kiếm đã tạo
        Optional<CartTool> existingCartTool = findExistingCartTool(cart, tool);

        if (existingCartTool.isPresent()) {
            // Cập nhật số lượng nếu tìm thấy
            CartTool existingTool = existingCartTool.get();
            existingTool.setQuantity(existingTool.getQuantity() + cartTool.getQuantity());
            return cartToolRepository.save(existingTool);
        } else {
            // Nếu chưa có row nào trùng thì tạo mới
            return cartToolRepository.save(cartTool);
        }
    }

    public Optional<CartTool> findExistingCartTool(Cart cart, Tool tool) {
        return cartToolRepository.findByCartAndTool(cart, tool);
    }

    public long isExist(CartTool cartTool) {
        Optional<CartTool> cartToolDBOptional = findExistingCartTool(cartTool.getCart(), cartTool.getTool());
        CartTool cartToolDb = cartToolDBOptional.orElse(null);
        if (cartToolDb != null) {
            return cartToolDb.getCartToolId();
        }
        return 0;
    }

    @Transactional
    public CartTool updateCartTool(long id, CartTool cartTool) throws IdInvalidException {
        CartTool dbCartTool = getCartToolById(id);

        if (cartTool.getCart() != null && cartTool.getCart().getCartId() != null) {
            ResCartDTO cart = cartService.getCartById(cartTool.getCart().getCartId());
            Cart dbCart = cartMapper.toCart(cart);
            dbCartTool.setCart(dbCart);
        }

        if (cartTool.getTool() != null && cartTool.getTool().getToolId() != 0) {
            Tool tool = toolRepository.findById(cartTool.getTool().getToolId())
                    .orElseThrow(() -> new IdInvalidException("Tool with id: " + cartTool.getTool().getToolId() + " not found"));
            dbCartTool.setTool(tool);
        }

        dbCartTool.setQuantity(cartTool.getQuantity());
        try {
            return cartToolRepository.save(dbCartTool);
        } catch (Exception e) {
            throw new RuntimeException("Could not commit JPA transaction: " + e.getMessage(), e);
        }
    }

    public ResPaginationDTO getAllCartTools(Pageable pageable, String cartId) throws IdInvalidException {
        // Kiểm tra tính hợp lệ của cartId
        if (cartId == null || cartId.isEmpty()) {
            throw new IdInvalidException("cartId is required");
        }

        // Sử dụng filterParser để tạo điều kiện lọc
        FilterNode node = filterParser.parse("cart.id='" + cartId + "'");
        FilterSpecification<CartTool> spec = filterSpecificationConverter.convert(node);

        // Lọc và phân trang dữ liệu theo cartId
        Page<CartTool> pageCartTool = cartToolRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageCartTool, pageable);
    }

    public void deleteCartTool(long id) throws IdInvalidException {
        CartTool cartTool = getCartToolById(id);
        cartToolRepository.deleteById(cartTool.getCartToolId());
    }

}
