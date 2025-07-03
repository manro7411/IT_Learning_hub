package QuizService.Entity;

import QuizService.QuestionType;
import jakarta.persistence.*;
import model.LearningContent;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Questions")
public class QuestionEntity {

    @Id
    @Column(length = 21)
    private String id;

    @Column(name = "quiz_id", length = 21, nullable = true)
    private String quiz_id;

    @ManyToOne
    @JoinColumn(name = "learning_content_id", nullable = false)
    private LearningContent learningContent;

    @Column(name = "question_text", nullable = false)
    private String questionText;

    private int points = 0;

    @Enumerated(EnumType.STRING)
    private QuestionType type;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "question", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuestionChoiceEntity> choices = new ArrayList<>();

    // Lifecycle
    @PrePersist
    public void prePersist() {
        this.createdAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuiz_id() {
        return quiz_id;
    }

    public void setQuiz_id(String quiz_id) {
        this.quiz_id = quiz_id;
    }

    public LearningContent getLearningContent() {
        return learningContent;
    }

    public void setLearningContent(LearningContent learningContent) {
        this.learningContent = learningContent;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public QuestionType getType() {
        return type;
    }

    public void setType(QuestionType type) {
        this.type = type;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<QuestionChoiceEntity> getChoices() {
        return choices;
    }

    public void setChoices(List<QuestionChoiceEntity> choices) {
        this.choices = choices;
    }
}
