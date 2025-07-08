package QuizService.Entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "Question_choice")
public class QuestionChoiceEntity {
    @Id
    @Column(length = 21)
    public String id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "question_id")
    @JsonIgnore
    public QuestionEntity question;

    @Column(name = "choice_text", nullable = false)
    public String choiceText;

    @Column(name = "is_correct")
    public boolean isCorrect = false;
}
