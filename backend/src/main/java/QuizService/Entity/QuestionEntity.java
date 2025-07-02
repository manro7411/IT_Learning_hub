package QuizService.Entity;

import QuizService.QuestionType;
import jakarta.persistence.*;
import model.LearningContent;
import java.time.OffsetDateTime;

@Entity
@Table(name = "Question")
public class QuestionEntity {
    @Id
    @Column(length = 21)
    private String id;

    @Column(name = "quiz_id", length = 21 , nullable = false)
    private String quiz_id;

    @ManyToOne
    @JoinColumn(name = "learning_content_id", nullable = false)
    private LearningContent learningContent;

    @Column(name = "question_text", nullable = false)
    private String questionText;

    private int points = 0;

    @Enumerated(EnumType.STRING)
    private QuestionType type;

    private OffsetDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = OffsetDateTime.now();
    }
}
