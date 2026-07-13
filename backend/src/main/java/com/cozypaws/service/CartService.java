package com.cozypaws.service;

import com.cozypaws.dto.request.CartItemRequest;
import com.cozypaws.dto.response.CartItemResponse;
import com.cozypaws.dto.response.CartResponse;
import com.cozypaws.entity.*;
import com.cozypaws.exception.ResourceNotFoundException;
import com.cozypaws.repository.CartRepository;
import com.cozypaws.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartResponse getCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));
        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse addItem(Long userId, CartItemRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));
        final Cart finalCart = cart;

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        finalCart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst()
                .ifPresentOrElse(
                        item -> item.setQuantity(item.getQuantity() + request.getQuantity()),
                        () -> {
                            CartItem newItem = CartItem.builder()
                                    .cart(finalCart)
                                    .product(product)
                                    .quantity(request.getQuantity())
                                    .build();
                            finalCart.getItems().add(newItem);
                        }
                );

        cart = cartRepository.save(finalCart);
        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse updateItem(Long userId, Long itemId, CartItemRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        item.setQuantity(request.getQuantity());
        cart = cartRepository.save(cart);
        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse removeItem(Long userId, Long itemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        cart.getItems().removeIf(item -> item.getId().equals(itemId));
        cart = cartRepository.save(cart);
        return toCartResponse(cart);
    }

    private Cart createNewCart(Long userId) {
        Cart cart = Cart.builder()
                .user(User.builder().id(userId).build())
                .items(new ArrayList<>())
                .build();
        return cartRepository.save(cart);
    }

    private CartResponse toCartResponse(Cart cart) {
        BigDecimal total = cart.getItems().stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .items(cart.getItems().stream().map(item ->
                        CartItemResponse.builder()
                                .id(item.getId())
                                .productId(item.getProduct().getId())
                                .name(item.getProduct().getName())
                                .image(getFirstImage(item.getProduct()))
                                .price(item.getProduct().getPrice())
                                .quantity(item.getQuantity())
                                .subtotal(item.getSubtotal())
                                .build()
                ).toList())
                .total(total)
                .build();
    }

    private String getFirstImage(Product product) {
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            return product.getImages().split(",")[0];
        }
        return null;
    }
}
