package com.cozypaws.service;

import com.cozypaws.dto.response.ProductResponse;
import com.cozypaws.entity.Product;
import com.cozypaws.exception.ResourceNotFoundException;
import com.cozypaws.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Page<ProductResponse> getProducts(Long categoryId, String sort, int page, int size) {
        Sort sorting = switch (sort == null ? "createdAt" : sort) {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "rating" -> Sort.by("rating").descending();
            default -> Sort.by("createdAt").descending();
        };

        Page<Product> products;
        if (categoryId != null) {
            products = productRepository.findByCategoryId(categoryId, PageRequest.of(page, size, sorting));
        } else {
            products = productRepository.findAll(PageRequest.of(page, size, sorting));
        }

        return products.map(this::toProductResponse);
    }

    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrue()
                .stream()
                .map(this::toProductResponse)
                .toList();
    }

    public ProductResponse getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return toProductResponse(product);
    }

    private ProductResponse toProductResponse(Product product) {
        List<String> images = product.getImages() != null
                ? Arrays.asList(product.getImages().split(","))
                : Collections.emptyList();

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .price(product.getPrice())
                .comparePrice(product.getComparePrice())
                .images(images)
                .stock(product.getStock())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .isFeatured(product.getIsFeatured())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .createdAt(product.getCreatedAt() != null ? product.getCreatedAt().toString() : null)
                .build();
    }
}
