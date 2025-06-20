package model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_content")
public class LearningContent {

    /* ───── Columns ───── */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    /* ข้อมูลผู้สร้างคอร์ส */
    @Column(name = "author_name")
    private String authorName;

    @Column(name = "author_email")              // 🆕
    private String authorEmail;

    @Column(name = "author_role")
    private String authorRole;

    @Column(name = "author_avatar_url")
    private String authorAvatarUrl;

    @Column(name = "progress_percent")
    private Integer progressPercent = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    /* ───── Getters ───── */
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public String getAuthorName() { return authorName; }
    public String getAuthorEmail() { return authorEmail; }     // 🆕
    public String getAuthorRole() { return authorRole; }
    public String getAuthorAvatarUrl() { return authorAvatarUrl; }
    public Integer getProgressPercent() { return progressPercent; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    /* ───── Setters ───── */
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setCategory(String category) { this.category = category; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public void setAuthorEmail(String authorEmail) { this.authorEmail = authorEmail; }   // 🆕
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }
    public void setAuthorAvatarUrl(String authorAvatarUrl) { this.authorAvatarUrl = authorAvatarUrl; }
    public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
