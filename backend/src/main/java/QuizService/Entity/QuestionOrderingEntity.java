package QuizService.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "question_ordering")
public class QuestionOrderingEntity {

    @Id
    @Column(length = 21)
    private String id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "question_id")
    public QuestionEntity question;

    @Column(name = "item_text", nullable = false)
    public String itemText;

    @Column(name = "expected_order", nullable = false)

    public int expectedOrder;


}
