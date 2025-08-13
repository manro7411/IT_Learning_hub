package Forum;
import jakarta.ws.rs.FormParam;
import org.jboss.resteasy.reactive.PartType;

import java.io.InputStream;

public class PostCreateRequest {

    @FormParam("title")

    public String title;

    @FormParam("message")

    public String message;

    @FormParam("authorName")

    public String authorName;

    @FormParam("forumCategory")

    public String forumCategory;

    @FormParam("picture")
    @PartType("application/octet-stream")

    public InputStream picture;

    @FormParam("pictureFileName")
    public String pictureFileName;
}
