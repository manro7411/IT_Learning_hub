package model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "LearningScore")
public class LearningScoreEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lesson_id" , nullable = false , length = 30)
    private String lessonId;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "overall_score")
    private int overallScore;

    @Column(name = "updated_at" , nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public Integer getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Integer overallScore) {
        this.overallScore = overallScore;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
