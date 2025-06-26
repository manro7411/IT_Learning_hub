package model;
import Forum.PostEntity;
import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class CommentEntity extends PanacheEntityBase {

    /* ────────── PK ────────── */
    @Id
    @Column(length = 21, nullable = false, updatable = false)
    private String id;

    /* ────────── FK ไปยัง Post ────────── */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false)
    private PostEntity post;          // <-- เชื่อมกับ PostEntity

    /* ────────── DATA ────────── */
    @NotBlank
    @Size(max = 100)
    @Column(name = "author_name", nullable = false, length = 100)
    private String authorName;

    @NotBlank
    @Column(name = "author_email", nullable = false, length = 150)
    private String authorEmail;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /* ────────── Lifecycle ────────── */
    @PrePersist
    void prePersist() {
        if (id == null || id.isBlank())
            id = NanoIdUtils.randomNanoId();

        if (createdAt == null)
            createdAt = LocalDateTime.now();
    }

    /* ────────── Getters / Setters ────────── */
    public String getId()                 { return id; }
    public PostEntity getPost()           { return post; }
    public String getAuthorName()         { return authorName; }
    public String getAuthorEmail()        { return authorEmail; }
    public String getMessage()            { return message; }
    public LocalDateTime getCreatedAt()   { return createdAt; }

    public void setPost(PostEntity p)         { this.post = p; }
    public void setAuthorName(String n)       { this.authorName = n; }
    public void setAuthorEmail(String e)      { this.authorEmail = e; }
    public void setMessage(String m)          { this.message = m; }
}
