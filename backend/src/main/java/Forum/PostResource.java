package Forum;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.RolesAllowed;
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
import java.nio.file.StandardCopyOption;
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
    @RolesAllowed("user")
    public List<PostEntity> getAllPosts() {
        List<PostEntity> posts = em.createQuery("SELECT p FROM PostEntity p ORDER BY p.createdAt DESC", PostEntity.class)
                .getResultList();

        String userEmail = identity.getPrincipal().getName();

        for (PostEntity post : posts) {
            String avatar = post.getAvatarUrl();
            if (avatar != null && !avatar.startsWith("http")) {
                String filename = Paths.get(avatar).getFileName().toString();
                post.setAvatarUrl("http://localhost:8080/posts/avatars/" + filename);
            }
            post.setLikedByUser(post.getLikedBy().contains(userEmail));
        }

        return posts;
    }
    @GET
    @Path("/{id}")
    @RolesAllowed("user")

    public PostEntity getOne(@PathParam("id") String id) {
        PostEntity post = em.find(PostEntity.class, id);
        if (post == null) throw new NotFoundException("Post not found");
        String avatar = post.getAvatarUrl();
        if (avatar != null && !avatar.startsWith("http")) {
            String filename = Paths.get(avatar).getFileName().toString();
            post.setAvatarUrl("http://localhost:8080/posts/avatars/" + filename);
        }
        String userEmail = identity.getPrincipal().getName();
        post.setLikedByUser(post.getLikedBy().contains(userEmail));

        return post;
    }

    @POST
    @Path("/{id}/like")
    @Transactional
    @RolesAllowed("user")
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

        return Response.ok().entity(Map.of("likes", post.getLikes(), "likedByUser", true)).build();
    }

    @POST
    @Path("/{id}/unlike")
    @Transactional
    @RolesAllowed("user")
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

        return Response.ok().entity(Map.of("likes", post.getLikes(), "likedByUser", false)).build();

    }
    @POST
    @Transactional
    @RolesAllowed("user")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
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
        post.setForumCategory(req.forumCategory);

        if (user.getAvatar() != null) {
            post.setAvatarUrl(user.getAvatar());
        }
        post.persist();
        String filename = post.getId() + ".jpg";
        if(req.picture != null){
            try {
                String originalName = req.pictureFileName != null ? req.pictureFileName : "picture.jpeg";
                java.nio.file.Path dir = java.nio.file.Paths.get("uploads/picture");
                java.nio.file.Files.createDirectories(dir);
                java.nio.file.Path picturePath = dir.resolve(filename);
                java.nio.file.Files.copy(req.picture, picturePath, StandardCopyOption.REPLACE_EXISTING);

                System.out.println("Picture path : " + picturePath.toString());
                System.out.println("Original file name: " + originalName);
                post.setPictureUrl("uploads/picture/" + filename);
            } catch (Exception e) {
                throw new InternalServerErrorException("Failed to save photo.");
            }
        }

        if (req.document != null) {
            try {
                String originalDoc = (req.documentFileName != null && !req.documentFileName.isBlank())
                        ? req.documentFileName : "document.bin";
                String docExt = "";
                int dot = originalDoc.lastIndexOf('.');

                if (dot >= 0 && dot < originalDoc.length() - 1) {
                    String extCandidate = originalDoc.substring(dot).toLowerCase();
                    if (extCandidate.matches("\\.[a-z0-9]{1,10}")) {
                        docExt = extCandidate;
                    }
                }


                String docFileName = "document_" + post.getId() + docExt;

                java.nio.file.Path dir = java.nio.file.Paths.get("uploads/postDocuments");
                java.nio.file.Files.createDirectories(dir);
                java.nio.file.Path docPath = dir.resolve(docFileName);
                java.nio.file.Files.copy(req.document, docPath, StandardCopyOption.REPLACE_EXISTING);
                System.out.println("Document path : " + docPath.toString());
                System.out.println("Original file name: " + originalDoc);

                post.setDocument(docFileName);
            }catch (Exception e) {
                throw new InternalServerErrorException("Failed to save document.");
            }
        }
        return Response.created(URI.create("/posts/" + post.getId()))
                .entity(post)
                .build();
    }
    @GET
    @Path("/picture/{filename}")
    @Produces({"image/jpeg", "image/png", "image/webp"})
    public Response getPicture(@PathParam("filename") String filename) {
        java.nio.file.Path picturePath = java.nio.file.Paths.get("uploads/picture/" + filename);
        if (!picturePath.toFile().exists()) {
            return Response.status(Response.Status.NOT_FOUND).entity("Picture not found").build();
        }
        try {
            return Response.ok().entity(picturePath.toFile()).build();
        }catch(Exception e){
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GET
    @Path("/postDocument/{filename}")
    public Response getPostDocument(@PathParam("filename") String filename){
        try {
            java.nio.file.Path file = Paths.get("uploads/postDocuments", filename);
            if (!Files.exists(file)) {
                throw new NotFoundException("File not found: " + filename);
            }

            String mimeType = Files.probeContentType(file);
            if (mimeType == null) {
                mimeType = "application/octet-stream";
            }

            return Response.ok(Files.newInputStream(file))
                    .type(mimeType)
                    .header("Content-Disposition", "inline; filename=\"" + filename + "\"")
                    .build();

        } catch (IOException e) {
            throw new InternalServerErrorException("Failed to load document: " + filename, e);
        }
    }
}