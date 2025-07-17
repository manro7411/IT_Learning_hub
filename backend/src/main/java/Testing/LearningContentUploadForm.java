package Testing;
import jakarta.ws.rs.FormParam;
import java.io.InputStream;
import java.util.List;

public class LearningContentUploadForm {

    @FormParam("title")
    public String title;

    @FormParam("description")
    public String description;

    @FormParam("category")
    public String category;

    @FormParam("thumbnailUrl")
    public String thumbnailUrl;

    @FormParam("authorAvatarUrl")
    public String authorAvatarUrl;

    @FormParam("maxAttempts")
    public Integer maxAttempts;

    @FormParam("contentType")
    public String contentType;

    @FormParam("assignType")
    public String assignType;

    @FormParam("assignedUserIds")
    public List<String> assignedUserIds;

    @FormParam("assignedTeamIds")
    public List<String> assignedTeamIds;

    @FormParam("dueDate")
    public String dueDate;

}
