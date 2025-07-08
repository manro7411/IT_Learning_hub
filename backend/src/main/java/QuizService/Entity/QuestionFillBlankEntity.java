package QuizService.Entity;
import jakarta.persistence.*;

@Entity
@Table(name = "question_fill_blanks")

public class QuestionFillBlankEntity {

    @Id
    @Column(length = 21)
    public String id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "question_id")
    public QuestionEntity question;

    @Column(name = "correct_answer", nullable = false)
    public String correctAnswer;
}
