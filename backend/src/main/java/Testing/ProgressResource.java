package Testing;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.UserLessonProgress;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.time.LocalDateTime;
import java.util.Optional;

@RequestScoped
@Path("/progress")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ProgressResource {

    @Inject EntityManager em;
    @Inject JsonWebToken jwt;
    @PUT
    @Path("/{lessonId}")
    @Transactional
    public Response updateProgress(@PathParam("lessonId") String lessonId, ProgressDto dto) {
        String userEmail = jwt.getSubject();

        if (userEmail == null || userEmail.isBlank()) {
            System.out.println("❌ No user email in JWT");
            throw new NotAuthorizedException("No user email in JWT");
        }

        int clamped = Math.max(0, Math.min(dto.getPercent(), 100));

        System.out.printf("📥 [PUT] /progress/%s\n", lessonId);
        System.out.printf("📧 userEmail = %s\n", userEmail);
        System.out.printf("📊 Incoming percent = %d\n", dto.getPercent());

        Optional<UserLessonProgress> existing = em.createQuery(
                        "SELECT p FROM UserLessonProgress p WHERE p.userEmail = :e AND p.lessonId = :l",
                        UserLessonProgress.class
                )
                .setParameter("e", userEmail)
                .setParameter("l", lessonId)
                .getResultStream()
                .findFirst();

        UserLessonProgress progress = existing.orElseGet(UserLessonProgress::new);
        progress.setUserEmail(userEmail);
        progress.setLessonId(lessonId);
        progress.setPercent(clamped);
        progress.setUpdatedAt(LocalDateTime.now());

        em.persist(progress);

        System.out.println("✅ Progress saved");

        return Response.ok().build();
    }

    // DTO class
    public static class ProgressDto {
        private int percent;

        public int getPercent() {
            return percent;
        }

        public void setPercent(int percent) {
            this.percent = percent;
        }
    }
}
