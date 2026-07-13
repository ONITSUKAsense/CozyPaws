package com.cozypaws.repository;

import com.cozypaws.entity.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BlogRepository extends JpaRepository<BlogPost, Long> {
    Optional<BlogPost> findBySlug(String slug);
}
