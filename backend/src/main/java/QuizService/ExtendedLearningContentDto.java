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

    // ✅ เพิ่มสอง field นี้
    public String assignType;
    public List<String> assignedUserIds;

    public ExtendedLearningContentDto() {}

    public ExtendedLearningContentDto(String title, String description, String category,
                                      String thumbnailUrl, String authorName,
                                      String authorEmail, Integer maxAttempts,
                                      List<QuestionDTO> questions,
                                      String assignType, List<String> assignedUserIds) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.thumbnailUrl = thumbnailUrl;
        this.authorName = authorName;
        this.authorEmail = authorEmail;
        this.maxAttempts = maxAttempts;
        this.questions = questions;
        this.assignType = assignType;
        this.assignedUserIds = assignedUserIds;
    }
}
