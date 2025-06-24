package Forum;

import Forum.dto.PostCreateRequest;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.util.List;
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
    public PostEntity getPostById(@PathParam("id") String id) {
        PostEntity post = PostEntity.findById(id);
        if (post == null) {
            throw new NotFoundException("Post not found");
        }
        return post;
    }
    @POST
    @Transactional
    public Response createPost(@Valid PostCreateRequest request) {
        String email = identity.getPrincipal().getName();

        String displayName = Optional.ofNullable(identity.getAttribute("name"))
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .orElse(email);

        PostEntity post = new PostEntity();
        post.setAuthorName(displayName);
        post.setAuthorEmail(email);
        post.setTitle(request.title);
        post.setMessage(request.message);
        post.persist();

        URI location = URI.create("/posts/" + post.getId());
        return Response.created(location).entity(post).build();
    }
}
