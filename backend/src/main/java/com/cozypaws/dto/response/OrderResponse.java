package com.cozypaws.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private String status;
    private BigDecimal total;
    private String shippingAddress;
    private String phone;
    private String note;
    private List<OrderItemResponse> items;
    private String createdAt;
}
