package model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_feedback")
public class UserFeedbackEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;


    @Column(nullable = false)
    private String feedback;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "author_avatar_url")
    private String authorAvatarUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "rating_score")
    private Integer ratingScore = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learning_content_id", nullable = false)
    private LearningContent learningContent;

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getAuthorAvatarUrl() {
        return authorAvatarUrl;
    }

    public void setAuthorAvatarUrl(String authorAvatarUrl) {
        this.authorAvatarUrl = authorAvatarUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LearningContent getLearningContent() {
        return learningContent;
    }

    public void setLearningContent(LearningContent learningContent) {
        this.learningContent = learningContent;
    }
    public Integer getRatingScore() {
        return ratingScore;
    }
    public void setRatingScore(Integer ratingScore) {
        this.ratingScore = ratingScore;
    }
}
