package QuizService;

import java.time.LocalDateTime;
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

    public String assignType;
    public List<String> assignedUserIds;
    public List<String> assignedTeamIds;
    public LocalDateTime dueDate;

    public ExtendedLearningContentDto() {}

    public ExtendedLearningContentDto(
            String title,
            String description,
            String category,
            String thumbnailUrl,
            String authorName,
            String authorEmail,
            Integer maxAttempts,
            List<QuestionDTO> questions,
            String assignType,
            List<String> assignedUserIds,
            List<String> assignedTeamIds,
            LocalDateTime dueDate
    ) {
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
        this.assignedTeamIds = assignedTeamIds;
        this.dueDate = dueDate;
    }

    public void setAssignedTeamId(String teamId) {
        this.assignedTeamIds = teamId != null ? List.of(teamId) : List.of();
    }
}
