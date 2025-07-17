package model;

import QuizService.Entity.QuestionEntity;
import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "learning_content")
public class LearningContent {

    @Id
    @Column(length = 21)
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

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "author_email")
    private String authorEmail;

    @Column(name = "author_role")
    private String authorRole;

    @Column(name = "author_avatar_url")
    private String authorAvatarUrl;

    @Column(name = "progress_percent")
    private Integer progressPercent = 0;

    @Column(name = "max_attempts", nullable = false)
    private Integer maxAttempts = 1;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "click_count", nullable = false)
    private Long clickCount = 0L;

    @OneToMany(mappedBy = "learningContent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuestionEntity> questions = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "learning_content_assigned_users", joinColumns = @JoinColumn(name = "learning_content_id"))
    @Column(name = "user_id")
    private List<String> assignedUserIds = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "learning_content_assigned_teams", joinColumns = @JoinColumn(name = "learning_content_id"))
    @Column(name = "team_id")
    private List<String> assignedTeamIds = new ArrayList<>();

    @Column(name = "assign_type")
    private String assignType;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "videoUrl")
    private String videoUrl;


    @PrePersist
    private void prePersist() {
        if (id == null || id.isBlank()) {
            id = NanoIdUtils.randomNanoId();
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public String getAuthorName() { return authorName; }
    public String getAuthorEmail() { return authorEmail; }
    public String getAuthorRole() { return authorRole; }
    public String getAuthorAvatarUrl() { return authorAvatarUrl; }
    public Integer getProgressPercent() { return progressPercent; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Long getClickCount() { return clickCount; }
    public Integer getMaxAttempts() { return maxAttempts; }
    public List<String> getAssignedUserIds() { return assignedUserIds; }
    public List<String> getAssignedTeamIds() { return assignedTeamIds; }
    public String getAssignType() { return assignType; }

    public void setId(String id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setCategory(String category) { this.category = category; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public void setAuthorEmail(String authorEmail) { this.authorEmail = authorEmail; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }
    public void setAuthorAvatarUrl(String authorAvatarUrl) { this.authorAvatarUrl = authorAvatarUrl; }
    public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setClickCount(Long clickCount) { this.clickCount = clickCount; }
    public void setMaxAttempts(Integer maxAttempts) { this.maxAttempts = maxAttempts; }
    public void setAssignedUserIds(List<String> assignedUserIds) { this.assignedUserIds = assignedUserIds; }
    public void setAssignedTeamIds(List<String> assignedTeamIds) { this.assignedTeamIds = assignedTeamIds; }
    public void setAssignType(String assignType) { this.assignType = assignType; }
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }
}
