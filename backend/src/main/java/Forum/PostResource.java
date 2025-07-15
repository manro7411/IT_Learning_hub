package Forum;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.User;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@Path("/posts")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class PostResource {

    @Inject
    SecurityIdentity identity;

    @Inject
    EntityManager em;

    @GET
    public List<PostEntity> getAllPosts() {
        List<PostEntity> posts = em.createQuery("SELECT p FROM PostEntity p ORDER BY p.createdAt DESC", PostEntity.class)
                .getResultList();

        for (PostEntity post : posts) {
            String avatar = post.getAvatarUrl();
            if (avatar != null && !avatar.startsWith("http")) {
                String filename = Paths.get(avatar).getFileName().toString();
                post.setAvatarUrl("http://localhost:8080/posts/avatars/" + filename);
            }
        }

        return posts;
    }

    @GET
    @Path("/avatars/{filename}")
    @Produces({"image/jpeg", "image/png", "image/webp"})
    public Response getAvatar(@PathParam("filename") String filename) {
        java.nio.file.Path path = Paths.get("uploads/avatars/" + filename);
        if (!Files.exists(path)) {
            return Response.status(Response.Status.NOT_FOUND).entity("Avatar not found: " + filename).build();
        }

        try {
            return Response.ok(Files.newInputStream(path)).build();
        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Failed to load avatar: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/{id}")
    public PostEntity getOne(@PathParam("id") String id) {
        PostEntity post = em.find(PostEntity.class, id);
        if (post == null) throw new NotFoundException("Post not found");

        String avatar = post.getAvatarUrl();
        if (avatar != null && !avatar.startsWith("http")) {
            String filename = Paths.get(avatar).getFileName().toString();
            post.setAvatarUrl("http://localhost:8080/posts/avatars/" + filename);
        }

        return post;
    }

    @POST
    @Path("/{id}/like")
    @Transactional
    public Response like(@PathParam("id") String id) {
        String userEmail = identity.getPrincipal().getName();
        PostEntity post = em.find(PostEntity.class, id);

        if (post == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Post not found").build();
        }

        if (!post.getLikedBy().contains(userEmail)) {
            post.addLike(userEmail);
            System.out.println("✅ User " + userEmail + " liked post " + id);
        } else {
            System.out.println("⚠️ User " + userEmail + " already liked post " + id);
        }

        return Response.ok().entity(Map.of("likes", post.getLikes())).build();
    }

    @POST
    @Path("/{id}/unlike")
    @Transactional
    public Response unlike(@PathParam("id") String id) {
        String userEmail = identity.getPrincipal().getName();
        PostEntity post = em.find(PostEntity.class, id);

        if (post == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Post not found").build();
        }

        if (post.getLikedBy().contains(userEmail)) {
            post.removeLike(userEmail);
            System.out.println("✅ User " + userEmail + " unliked post " + id);
        } else {
            System.out.println("⚠️ User " + userEmail + " has not liked post " + id);
        }

        return Response.ok().entity(Map.of("likes", post.getLikes())).build();
    }
    @POST
    @Transactional
    public Response create(@Valid PostCreateRequest req) {
        String email = identity.getPrincipal().getName();
        String displayName = Optional.ofNullable(req.authorName).filter(s -> !s.isBlank()).orElse(email);

        User user = em.createQuery("SELECT u FROM User u WHERE u.email = :email", User.class)
                .setParameter("email", email)
                .getSingleResult();

        PostEntity post = new PostEntity();
        post.setAuthorName(displayName);
        post.setAuthorEmail(email);
        post.setTitle(req.title);
        post.setMessage(req.message);

        if (user.getAvatar() != null) {
            post.setAvatarUrl(user.getAvatar());
        }

        post.persist();

        return Response.created(URI.create("/posts/" + post.getId()))
                .entity(post)
                .build();
    }
}
