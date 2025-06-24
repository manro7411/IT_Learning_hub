package Forum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PostCreateRequest {

    @NotBlank(message = "Title must not be blank")
    @Size(max = 255, message = "Title must be at most 255 characters")
    public String title;

    @NotBlank(message = "Message must not be blank")
    public String message;

    @Size(max = 100, message = "Author name must be at most 100 characters")
    public String authorName;
}
