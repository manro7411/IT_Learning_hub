package model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_lesson_progress")
public class UserLessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lesson_id", nullable = false, length = 30)
    private String lessonId;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private Integer percent = 0;

    @Column(name = "score")
    private Integer score = 0;

    @Column(name = "attempts", nullable = false)
    private Integer attempts = 0;

    @Column(name = "last_timestamp", nullable = false)
    private Integer lastTimestamp = 0;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public String getLessonId() {
        return lessonId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public Integer getPercent() {
        return percent;
    }

    public Integer getScore() {
        return score;
    }

    public Integer getAttempts() {
        return attempts;
    }

    public Integer getLastTimestamp() {
        return lastTimestamp;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // --- Setter ---
    public void setLessonId(String lessonId) {
        this.lessonId = lessonId;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setPercent(Integer percent) {
        this.percent = percent;
    }

    public void setScore(Integer score) {
        this.score = score;
    }


    public void setAttempts(Integer attempts) {
        this.attempts = attempts;
    }

    public void setLastTimestamp(Integer lastTimestamp) {
        this.lastTimestamp = lastTimestamp;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }
    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }
}
