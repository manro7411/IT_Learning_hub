package QuizService;

import java.util.List;

public class ExtendedLearningContentDto {
    public String title;
    public String description;
    public String category;
    public String thumbnailUrl;
    public String authorName;
    public String authorEmail;
    public Integer maxAttempts;
    public List<QuestionDTO> questions;

    public ExtendedLearningContentDto() {}

    public ExtendedLearningContentDto(String title, String description, String category,
                                      String thumbnailUrl, String authorName,
                                      String authorEmail, Integer maxAttempts,
                                      List<QuestionDTO> questions) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.thumbnailUrl = thumbnailUrl;
        this.authorName = authorName;
        this.authorEmail = authorEmail;
        this.maxAttempts = maxAttempts;
        this.questions = questions;
    }
}