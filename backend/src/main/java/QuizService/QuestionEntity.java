package QuizService;

import jakarta.persistence.*;
import model.LearningContent;

@Entity
public class QuestionEntity {
    @Id
    @Column(length = 21)
    private String id;
    @Column(length = 21)
    private String quiz_id;
    @ManyToOne
    @JoinColumn(name = "learning_content_id", nullable = false)
    private LearningContent learningContent;
    private String Question_text;
    private int points = 0;
    private String createdAt;

    private QuestionType type;
}
