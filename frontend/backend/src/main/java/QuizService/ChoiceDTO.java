package QuizService;

public class ChoiceDTO {
    public String text;
    public boolean isCorrect;

    public ChoiceDTO() {}

    public ChoiceDTO(String text, boolean isCorrect) {
        this.text = text;
        this.isCorrect = isCorrect;
    }
}
