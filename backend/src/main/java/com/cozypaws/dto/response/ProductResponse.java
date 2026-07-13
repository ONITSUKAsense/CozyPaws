package com.cozypaws.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private BigDecimal comparePrice;
    private List<String> images;
    private Integer stock;
    private Long categoryId;
    private String categoryName;
    private Boolean isFeatured;
    private BigDecimal rating;
    private Integer reviewCount;
    private String createdAt;
}
