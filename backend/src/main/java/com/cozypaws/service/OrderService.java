package com.cozypaws.service;

import com.cozypaws.dto.response.OrderItemResponse;
import com.cozypaws.dto.response.OrderResponse;
import com.cozypaws.entity.*;
import com.cozypaws.exception.ResourceNotFoundException;
import com.cozypaws.repository.CartRepository;
import com.cozypaws.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;

    @Transactional
    public OrderResponse createOrder(Long userId, String shippingAddress, String phone, String note) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        BigDecimal total = cart.getItems().stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .orderNumber("CP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(User.builder().id(userId).build())
                .status("PENDING")
                .total(total)
                .shippingAddress(shippingAddress)
                .phone(phone)
                .note(note)
                .build();
        final Order finalOrder = order;

        List<OrderItem> orderItems = cart.getItems().stream().map(ci ->
                OrderItem.builder()
                        .order(finalOrder)
                        .product(ci.getProduct())
                        .productName(ci.getProduct().getName())
                        .price(ci.getProduct().getPrice())
                        .quantity(ci.getQuantity())
                        .build()
        ).toList();

        finalOrder.setItems(orderItems);
        order = orderRepository.save(finalOrder);

        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return toOrderResponse(order);
    }

    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toOrderResponse)
                .toList();
    }

    public OrderResponse getOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return toOrderResponse(order);
    }

    private OrderResponse toOrderResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .total(order.getTotal())
                .shippingAddress(order.getShippingAddress())
                .phone(order.getPhone())
                .note(order.getNote())
                .items(order.getItems().stream().map(item ->
                        OrderItemResponse.builder()
                                .id(item.getId())
                                .productId(item.getProduct().getId())
                                .productName(item.getProductName())
                                .price(item.getPrice())
                                .quantity(item.getQuantity())
                                .build()
                ).toList())
                .createdAt(order.getCreatedAt() != null ? order.getCreatedAt().toString() : null)
                .build();
    }
}
