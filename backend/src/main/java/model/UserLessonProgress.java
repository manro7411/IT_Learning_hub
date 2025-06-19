package model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_lesson_progress")
public class UserLessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail; // ✅ เพิ่ม field นี้

    @Column(name = "lesson_id", nullable = false)
    private Long lessonId;

    @Column(name = "percent", nullable = false)
    private Integer percent = 0;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public UserLessonProgress() {}

    @PrePersist
    public void prePersist() {
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // --- Getters ---
    public Long getId() { return id; }
    public String getUserEmail() { return userEmail; } // ✅
    public Long getLessonId() { return lessonId; }
    public Integer getPercent() { return percent; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // --- Setters ---
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; } // ✅
    public void setLessonId(Long lessonId) { this.lessonId = lessonId; }
    public void setPercent(Integer percent) { this.percent = percent; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
