package Forum;
import jakarta.ws.rs.FormParam;
import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.RestForm;

import java.io.InputStream;

public class PostCreateRequest {

    @RestForm
    public String title;

    @RestForm
    public String message;

    @RestForm
    public String authorName;

    @RestForm
    public String forumCategory;

    @RestForm
    @PartType("application/octet-stream")

    public InputStream picture;

    @RestForm
    public String pictureFileName;

    @RestForm
    @PartType("application/octet-stream")
    public InputStream document;

    @RestForm
    public String documentFileName;
}
