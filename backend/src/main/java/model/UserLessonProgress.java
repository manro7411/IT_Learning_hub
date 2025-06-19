package model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_lesson_progress")
public class UserLessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "lesson_id", nullable = false)
    private Long lessonId;

    @Column(nullable = false)
    private Integer percent = 0;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    // ✅ Constructors
    public UserLessonProgress() {}

    // ✅ Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getLessonId() { return lessonId; }
    public Integer getPercent() { return percent; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // ✅ Setters
    public void setUserId(Long userId) { this.userId = userId; }
    public void setLessonId(Long lessonId) { this.lessonId = lessonId; }
    public void setPercent(Integer percent) { this.percent = percent; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
