package QuizService;

import java.util.List;

public class QuestionDTO {
    public String questionText;
    public String type; // เช่น "MULTIPLE", "TRUE_FALSE", "FILL_IN_THE_BLANK"
    public Integer points = 1;
    public List<ChoiceDTO> choices;

    public QuestionDTO() {}

    public QuestionDTO(String questionText, String type, int points, List<ChoiceDTO> choices) {
        this.questionText = questionText;
        this.type = type;
        this.points = points;
        this.choices = choices;
    }
}
