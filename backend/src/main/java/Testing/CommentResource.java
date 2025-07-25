package Testing;
import Forum.PostEntity;
import dto.CommentDto;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.CommentEntity;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.net.URI;
import java.util.List;

@Path("/forum/posts/{postId}/comments")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CommentResource {

    @Inject EntityManager em;
    @Inject JsonWebToken jwt;

    /* ────────── 1) list comments ────────── */
    @GET
    public List<CommentDto> list(@PathParam("postId") String postId) {
        return em.createQuery("""
                    SELECT c FROM CommentEntity c
                    WHERE c.post.id = :pid
                    ORDER BY c.createdAt ASC
                """, CommentEntity.class)
                .setParameter("pid", postId)
                .getResultStream()
                .map(CommentDto::fromEntity)
                .toList();
    }

    /* ────────── 2) create comment ────────── */
    @POST
    @Transactional
    public Response create(@PathParam("postId") String postId,
                           CommentDto dto) {

        PostEntity post = em.find(PostEntity.class, postId);
        if (post == null) throw new NotFoundException("Post not found");

        CommentEntity comment = dto.toEntity(post);

        if (comment.getAuthorName() == null || comment.getAuthorName().isBlank())
            comment.setAuthorName(jwt.getClaim("name"));

        if (comment.getAuthorEmail() == null || comment.getAuthorEmail().isBlank())
            comment.setAuthorEmail(jwt.getSubject());

        em.persist(comment);

        return Response
                .created(URI.create("/forum/posts/" + postId + "/comments/" + comment.getId()))
                .entity(CommentDto.fromEntity(comment))
                .build();
    }

    /* ────────── 3) delete comment ────────── */
    @DELETE
    @Path("/{commentId}")
    @Transactional
    @RolesAllowed("admin")
    public void delete(@PathParam("commentId") String commentId) {
        CommentEntity c = em.find(CommentEntity.class, commentId);
        if (c != null) em.remove(c);
    }
}
