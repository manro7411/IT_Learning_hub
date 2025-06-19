package Testing;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.UserLessonProgress;
import org.eclipse.microprofile.jwt.JsonWebToken;
import model.UserLessonProgress;
import java.time.LocalDateTime;
import java.util.Optional;

@Path("/progress")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ProgressResource {

    @Inject EntityManager em;
    @Inject JsonWebToken jwt;

    @PUT
    @Path("/{lessonId}")
    @Transactional
    public Response updateProgress(@PathParam("lessonId") Long lessonId, ProgressDto dto) {
        String subject = jwt.getSubject();
        if (subject == null) throw new NotAuthorizedException("No user ID in JWT");

        Long userId;
        try {
            userId = Long.parseLong(subject);
        } catch (NumberFormatException e) {
            throw new BadRequestException("Invalid user ID format");
        }

        int clamped = Math.max(0, Math.min(dto.percent, 100));

        Optional<UserLessonProgress> existing = em
                .createQuery("SELECT p FROM UserLessonProgress p WHERE p.userId = :u AND p.lessonId = :l"
                        , UserLessonProgress.class)
                .setParameter("u", userId)
                .setParameter("l", lessonId)
                .getResultStream()
                .findFirst();

        UserLessonProgress progress;
        if (existing.isPresent()) {
            progress = existing.get();
            progress.setPercent(clamped);
            progress.setUpdatedAt(LocalDateTime.now());
        } else {
            progress = new UserLessonProgress();
            progress.setUserId(userId);
            progress.setLessonId(lessonId);
            progress.setPercent(clamped);
            progress.setUpdatedAt(LocalDateTime.now());
            em.persist(progress);
        }

        return Response.ok().build();
    }

    public static class ProgressDto {
        public int percent;
    }
}
