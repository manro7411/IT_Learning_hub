package QuizService.Entity;
import jakarta.persistence.*;

@Entity
@Table(name = "question_matching")
public class QuestionMatchingEntity {

    @Id
    @Column(length = 21)
    public String id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "question_id")
    public QuestionEntity question;

    @Column(name = "prompt_text", nullable = false)
    public String promptText;

    @Column(name = "match_text", nullable = false)
    public String matchText;
}
