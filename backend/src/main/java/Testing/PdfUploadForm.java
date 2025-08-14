package Testing;

import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

public class PdfUploadForm {

    @RestForm
    public String title;

    @RestForm
    public String description;

    @RestForm
    public String avatarUrl;

    @RestForm
    public String category;

    @RestForm
    public String assignType;

    @RestForm
    public String assignTeamId;

    @RestForm
    public String thumbnailUrl;

    @RestForm
    @PartType(MediaType.APPLICATION_OCTET_STREAM)
    public FileUpload document;
}
