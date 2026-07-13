package com.cozypaws.controller;

import com.cozypaws.dto.request.CartItemRequest;
import com.cozypaws.dto.response.OrderResponse;
import com.cozypaws.dto.response.ProductResponse;
import com.cozypaws.entity.*;
import com.cozypaws.exception.ResourceNotFoundException;
import com.cozypaws.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    // ─── Dashboard ───
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {
        long productCount = productRepository.count();
        long orderCount = orderRepository.count();
        long userCount = userRepository.count();
        BigDecimal totalRevenue = orderRepository.findAll().stream()
                .filter(o -> "DELIVERED".equals(o.getStatus()))
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return ResponseEntity.ok(Map.of(
                "productCount", productCount,
                "orderCount", orderCount,
                "userCount", userCount,
                "totalRevenue", totalRevenue
        ));
    }

    // ─── Products ───
    @PostMapping("/products")
    public ResponseEntity<ProductResponse> createProduct(@RequestBody Map<String, Object> body) {
        Category category = categoryRepository.findById(Long.valueOf(body.get("categoryId").toString()))
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = Product.builder()
                .name((String) body.get("name"))
                .slug(((String) body.get("name")).toLowerCase().replaceAll("\\s+", "-"))
                .description((String) body.get("description"))
                .price(new BigDecimal(body.get("price").toString()))
                .images((String) body.get("images"))
                .stock(Integer.parseInt(body.get("stock").toString()))
                .category(category)
                .isFeatured(body.containsKey("isFeatured") && Boolean.TRUE.equals(body.get("isFeatured")))
                .rating(BigDecimal.ZERO)
                .reviewCount(0)
                .build();

        product = productRepository.save(product);
        return ResponseEntity.ok(toProductResponse(product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id,
                                                          @RequestBody Map<String, Object> body) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (body.containsKey("name")) product.setName((String) body.get("name"));
        if (body.containsKey("description")) product.setDescription((String) body.get("description"));
        if (body.containsKey("price")) product.setPrice(new BigDecimal(body.get("price").toString()));
        if (body.containsKey("images")) product.setImages((String) body.get("images"));
        if (body.containsKey("stock")) product.setStock(Integer.parseInt(body.get("stock").toString()));
        if (body.containsKey("categoryId")) {
            Category category = categoryRepository.findById(Long.valueOf(body.get("categoryId").toString()))
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }
        if (body.containsKey("isFeatured")) product.setIsFeatured(Boolean.TRUE.equals(body.get("isFeatured")));

        product = productRepository.save(product);
        return ResponseEntity.ok(toProductResponse(product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ─── Categories ───
    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category body) {
        Category category = Category.builder()
                .name(body.getName())
                .slug(body.getSlug())
                .description(body.getDescription())
                .build();
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category body) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (body.getName() != null) category.setName(body.getName());
        if (body.getSlug() != null) category.setSlug(body.getSlug());
        if (body.getDescription() != null) category.setDescription(body.getDescription());
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ─── Orders ───
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toOrderResponse)
                .toList();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id,
                                                            @RequestBody Map<String, String> body) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(body.get("status"));
        order = orderRepository.save(order);
        return ResponseEntity.ok(toOrderResponse(order));
    }

    // ─── Blog ───
    @GetMapping("/blog/{id}")
    public ResponseEntity<BlogPost> getBlogPost(@PathVariable Long id) {
        return blogRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/blog")
    public ResponseEntity<BlogPost> createBlogPost(@RequestBody BlogPost body) {
        BlogPost post = BlogPost.builder()
                .title(body.getTitle())
                .slug(body.getSlug() != null ? body.getSlug() :
                        body.getTitle().toLowerCase().replaceAll("\\s+", "-"))
                .content(body.getContent())
                .excerpt(body.getExcerpt())
                .coverImage(body.getCoverImage())
                .author(body.getAuthor() != null ? body.getAuthor() : "Admin")
                .published(body.getPublished() != null ? body.getPublished() : true)
                .build();
        return ResponseEntity.ok(blogRepository.save(post));
    }

    @PutMapping("/blog/{id}")
    public ResponseEntity<BlogPost> updateBlogPost(@PathVariable Long id, @RequestBody BlogPost body) {
        BlogPost post = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found"));
        if (body.getTitle() != null) post.setTitle(body.getTitle());
        if (body.getContent() != null) post.setContent(body.getContent());
        if (body.getExcerpt() != null) post.setExcerpt(body.getExcerpt());
        if (body.getCoverImage() != null) post.setCoverImage(body.getCoverImage());
        if (body.getAuthor() != null) post.setAuthor(body.getAuthor());
        if (body.getPublished() != null) post.setPublished(body.getPublished());
        return ResponseEntity.ok(blogRepository.save(post));
    }

    @DeleteMapping("/blog/{id}")
    public ResponseEntity<Void> deleteBlogPost(@PathVariable Long id) {
        blogRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ─── Helpers ───
    private ProductResponse toProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .price(product.getPrice())
                .comparePrice(product.getComparePrice())
                .images(product.getImages() != null ? List.of(product.getImages().split(",")) : List.of())
                .stock(product.getStock())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .isFeatured(product.getIsFeatured())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .createdAt(product.getCreatedAt() != null ? product.getCreatedAt().toString() : null)
                .build();
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
                        com.cozypaws.dto.response.OrderItemResponse.builder()
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
