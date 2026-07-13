package com.cozypaws.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private Long productId;
    private String name;
    private String image;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;
}
