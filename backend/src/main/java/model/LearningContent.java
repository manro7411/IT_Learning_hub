package model;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "learning_content")
public class LearningContent {

    @Id
    @Column(length = 21)              // NanoId default = 21 chars
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "author_name")
    private String authorName;

    @Column(name = "author_email")
    private String authorEmail;

    @Column(name = "author_role")
    private String authorRole;

    @Column(name = "author_avatar_url")
    private String authorAvatarUrl;

    @Column(name = "progress_percent")
    private Integer progressPercent = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "click_count", nullable = false)
    private Long clickCount = 0L;

    @PrePersist
    private void prePersist() {

        if (id == null || id.isBlank()) {
            id = NanoIdUtils.randomNanoId();
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public String getId()               { return id; }
    public String getTitle()            { return title; }
    public String getDescription()      { return description; }
    public String getCategory()         { return category; }
    public String getThumbnailUrl()     { return thumbnailUrl; }
    public String getAuthorName()       { return authorName; }
    public String getAuthorEmail()      { return authorEmail; }
    public String getAuthorRole()       { return authorRole; }
    public String getAuthorAvatarUrl()  { return authorAvatarUrl; }
    public Integer getProgressPercent() { return progressPercent; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(String id)                          { this.id = id; }
    public void setTitle(String title)                    { this.title = title; }
    public void setDescription(String description)        { this.description = description; }
    public void setCategory(String category)              { this.category = category; }
    public void setThumbnailUrl(String thumbnailUrl)      { this.thumbnailUrl = thumbnailUrl; }
    public void setAuthorName(String authorName)          { this.authorName = authorName; }
    public void setAuthorEmail(String authorEmail)        { this.authorEmail = authorEmail; }
    public void setAuthorRole(String authorRole)          { this.authorRole = authorRole; }
    public void setAuthorAvatarUrl(String authorAvatarUrl){ this.authorAvatarUrl = authorAvatarUrl; }
    public void setProgressPercent(Integer progress)      { this.progressPercent = progress; }
    public void setCreatedAt(LocalDateTime createdAt)     { this.createdAt = createdAt; }
    public Long getClickCount() { return clickCount; }
    public void setClickCount(Long clickCount) { this.clickCount = clickCount; }

}