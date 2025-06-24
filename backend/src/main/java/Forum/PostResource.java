package Forum;
import Forum.PostCreateRequest;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@Path("/posts")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class PostResource {
    @Inject
    SecurityIdentity identity;
    @GET
    public List<PostEntity> getAllPosts() {
        return PostEntity.find("ORDER BY createdAt DESC").list();
    }
    @GET
    @Path("/{id}")
    public PostEntity getOne(@PathParam("id") String id) {
        PostEntity p = PostEntity.findById(id);
        if (p == null) throw new NotFoundException("Post not found");
        return p;
    }
    @POST
    @Transactional
    public Response create(@Valid PostCreateRequest req) {

        String email = identity.getPrincipal().getName();

        String fromBody = (req.authorName != null && !req.authorName.isBlank())
                ? req.authorName
                : null;
        String displayName = Optional.ofNullable(fromBody).orElse(email);

        PostEntity post = new PostEntity();
        post.setAuthorName(displayName);
        post.setAuthorEmail(email);
        post.setTitle(req.title);
        post.setMessage(req.message);
        post.persist();

        return Response.created(URI.create("/posts/" + post.getId()))
                .entity(post)
                .build();
    }
}
