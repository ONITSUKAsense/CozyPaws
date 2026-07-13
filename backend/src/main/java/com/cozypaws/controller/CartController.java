package com.cozypaws.controller;

import com.cozypaws.dto.request.CartItemRequest;
import com.cozypaws.dto.response.CartResponse;
import com.cozypaws.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(Authentication authentication,
                                                 @Valid @RequestBody CartItemRequest request) {
        Long userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(cartService.addItem(userId, request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateItem(Authentication authentication,
                                                    @PathVariable Long itemId,
                                                    @Valid @RequestBody CartItemRequest request) {
        Long userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(cartService.updateItem(userId, itemId, request));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeItem(Authentication authentication,
                                                    @PathVariable Long itemId) {
        Long userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(cartService.removeItem(userId, itemId));
    }
}
