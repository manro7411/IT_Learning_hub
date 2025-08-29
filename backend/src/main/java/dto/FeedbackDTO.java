package dto;

import model.UserFeedbackEntity;

import java.time.LocalDateTime;

public class FeedbackDTO {
    private String feedback;
    private String userEmail;
    private String authorAvatarUrl;
    private LocalDateTime createdAt;
    private Integer rating;

    public FeedbackDTO(UserFeedbackEntity entity) {
        this.feedback = entity.getFeedback();
        this.userEmail = entity.getUserEmail();
        this.authorAvatarUrl = entity.getAuthorAvatarUrl();
        this.createdAt = entity.getCreatedAt();
        this.rating = entity.getRatingScore();
    }

    public String getFeedback() {
        return feedback;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getAuthorAvatarUrl() {
        return authorAvatarUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public Integer getRating() {
        return rating;
    }
    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}
