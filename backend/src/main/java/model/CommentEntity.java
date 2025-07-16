package model;

import Forum.PostEntity;
import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class CommentEntity {

    @Id
    @Column(length = 21, nullable = false, updatable = false)
    private String id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "post_id")
    private PostEntity post;

    @NotBlank
    @Column(name = "author_name", nullable = false, length = 100)
    private String authorName;

    @NotBlank
    @Column(name = "author_email", nullable = false, length = 150)
    private String authorEmail;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "avatarUrl")
    private String avatarUrl;

    @PrePersist
    public void prePersist() {
        if (id == null || id.isBlank()) id = NanoIdUtils.randomNanoId();
        createdAt = LocalDateTime.now();
    }

    // Getters & Setters
    public String getId() { return id; }
    public PostEntity getPost() { return post; }
    public String getAuthorName() { return authorName; }
    public String getAuthorEmail() { return authorEmail; }
    public String getMessage() { return message; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setPost(PostEntity post) { this.post = post; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public void setAuthorEmail(String authorEmail) { this.authorEmail = authorEmail; }
    public void setMessage(String message) { this.message = message; }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
