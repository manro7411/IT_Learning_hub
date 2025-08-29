package AdminFeedback;

import java.time.LocalDateTime;
import java.util.UUID;

public class AdminFeedbackDTO {
    private UUID id;
    private String lessonId;
    private String userEmail;
    private String adminEmail;
    private String feedback;
    private LocalDateTime createdAt;
    private Boolean isSeen;

    public AdminFeedbackDTO() {}

    public AdminFeedbackDTO(UUID id, String lessonId, String userEmail, String adminEmail, String feedback, LocalDateTime createdAt, Boolean isSeen) {
        this.id = id;
        this.lessonId = lessonId;
        this.userEmail = userEmail;
        this.adminEmail = adminEmail;
        this.feedback = feedback;
        this.createdAt = createdAt;
        this.isSeen = isSeen;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getLessonId() {
        return lessonId;
    }

    public void setLessonId(String lessonId) {
        this.lessonId = lessonId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getAdminEmail() {
        return adminEmail;
    }

    public void setAdminEmail(String adminEmail) {
        this.adminEmail = adminEmail;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getSeen() {
        return isSeen;
    }

    public void setSeen(Boolean seen) {
        isSeen = seen;
    }
}
