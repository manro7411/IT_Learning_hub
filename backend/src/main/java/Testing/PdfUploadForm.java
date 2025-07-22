package Testing;

import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.io.InputStream;

public class PdfUploadForm {
    @RestForm
    public String title;

    @RestForm
    public String description;

    @RestForm
    public String avatarUrl;

    @RestForm
    public FileUpload document;

    @RestForm
    public org.jboss.resteasy.reactive.multipart.FileUpload documentMeta;
}
