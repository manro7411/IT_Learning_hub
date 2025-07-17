package QuizService;
import jakarta.ws.rs.FormParam;
import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;

public class ExtendedLearningContentDto {

    @FormParam("title")
    public String title;

    @FormParam("description")
    public String description;

    @FormParam("category")
    public String category;

    @FormParam("thumbnailUrl")
    public String thumbnailUrl;

    @FormParam("authorName")
    public String authorName;

    @FormParam("contentType")
    public String contentType;

    @FormParam("authorEmail")
    public String authorEmail;

    @FormParam("authorAvatarUrl")
    public String authorAvatarUrl;

    @FormParam("maxAttempts")
    public Integer maxAttempts;

    // This will not be passed in multipart directly (questions should come separately or be serialized if needed)
    public List<QuestionDTO> questions;

    // 🟡 Actual uploaded video
    @FormParam("video")
    @PartType("application/octet-stream")
    public InputStream videoStream;

    @FormParam("video")
    public FileUpload videoMeta;

    @FormParam("assignType")
    public String assignType;

    @FormParam("assignedUserIds")
    public List<String> assignedUserIds;

    @FormParam("assignedTeamIds")
    public List<String> assignedTeamIds;

    @FormParam("dueDate")
    public LocalDateTime dueDate;

    public ExtendedLearningContentDto() {}

    public void setAssignedTeamId(String teamId) {
        this.assignedTeamIds = teamId != null ? List.of(teamId) : List.of();
    }
}
