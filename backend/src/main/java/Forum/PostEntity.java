package Forum;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class PostEntity extends PanacheEntityBase {
    @Id
    @Column(length = 21, nullable = false, updatable = false)
    private String id;

    @NotBlank
    @Size(max = 100)
    @Column(name = "author_name", nullable = false, length = 100)
    private String authorName;

    @NotBlank
    @Column(name = "author_email", nullable = false, length = 150)
    private String authorEmail;

    @NotBlank
    @Size(max = 255)
    private String title;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private long likes = 0;

    @Column(nullable = false)
    private long views = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        if (id == null || id.isBlank()) id = NanoIdUtils.randomNanoId();
        createdAt  = LocalDateTime.now();
        updatedAt  = createdAt;
    }

    @PreUpdate
    void preUpdate() { updatedAt = LocalDateTime.now(); }

    public String getId()            { return id; }
    public String getAuthorName()    { return authorName; }
    public String getAuthorEmail()   { return authorEmail; }
    public String getTitle()         { return title; }
    public String getMessage()       { return message; }
    public long   getLikes()         { return likes; }
    public long   getViews()         { return views; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setAuthorName(String n)     { this.authorName = n; }
    public void setAuthorEmail(String e)    { this.authorEmail = e; }
    public void setTitle(String t)          { this.title = t; }
    public void setMessage(String m)        { this.message = m; }
    public void setLikes(long l)            { this.likes = l; }
    public void setViews(long v)            { this.views = v; }
}
