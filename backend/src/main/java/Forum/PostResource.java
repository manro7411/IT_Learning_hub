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

    /* --------- READ --------- */

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

    /* --------- CREATE --------- */

    @POST
    @Transactional
    public Response create(@Valid PostCreateRequest req) {

        /* email จาก principal – มักเป็น sub / upn */
        String email = identity.getPrincipal().getName();

        /* (1) authorName จาก BODY (ถ้ามี) */
        String fromBody = (req.authorName != null && !req.authorName.isBlank())
                ? req.authorName
                : null;

        /* (2) claim "name" ใน JWT */
        String fromJwt  = Optional.ofNullable(identity.getAttribute("claims"))
                .filter(Map.class::isInstance)
                .map(Map.class::cast)
                .map(m -> m.get("name"))
                .map(Object::toString)
                .orElse(null);

        /* (3) attribute "full_name" จาก JDBC realm */
        String fromJdbc = Optional.ofNullable(identity.getAttribute("full_name"))
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .orElse(null);

        /* ลำดับความสำคัญ: BODY → JWT → JDBC → email */
        String displayName = Optional.ofNullable(fromBody)
                .orElse(Optional.ofNullable(fromJwt)
                        .orElse(Optional.ofNullable(fromJdbc)
                                .orElse(email)));

        /* ---- log ---- */
        System.out.println("---------- POST /posts ----------");
        System.out.println("fromBody            = " + fromBody);
        System.out.println("JWT  claim \"name\"  = " + fromJwt);
        System.out.println("JDBC attr full_name = " + fromJdbc);
        System.out.println("email (principal)   = " + email);
        System.out.println("displayName chosen  = " + displayName);
        System.out.println("---------------------------------");

        /* ---- persist ---- */
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
