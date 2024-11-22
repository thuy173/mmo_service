package com.example.mmoapi.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "post_category_id")
    private PostCategory postCategory;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User author;

    private String title;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "short_content", columnDefinition = "TEXT")
    private String shortContent;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
