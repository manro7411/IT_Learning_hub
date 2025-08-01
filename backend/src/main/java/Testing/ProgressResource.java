package Testing;

import dto.LearningContentDto;
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.LearningContent;
import model.UserLessonProgress;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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
            throw new NotAuthorizedException("No user email in JWT");
        }

        int clamped = Math.max(0, Math.min(dto.getPercent(), 100));
        int lastTs = Math.max(0, dto.getLastTimestamp());

        Optional<UserLessonProgress> existing = em.createQuery(
                        "SELECT p FROM UserLessonProgress p WHERE p.userEmail = :e AND p.lessonId = :l",
                        UserLessonProgress.class)
                .setParameter("e", userEmail)
                .setParameter("l", lessonId)
                .getResultStream()
                .findFirst();

        UserLessonProgress progress = existing.orElseGet(UserLessonProgress::new);
        progress.setUserEmail(userEmail);
        progress.setLessonId(lessonId);
        progress.setPercent(clamped);
        progress.setLastTimestamp(lastTs);
        progress.setUpdatedAt(LocalDateTime.now());
        if (dto.getLastTimestamp() > 0 && dto.getLastTimestamp() >= progress.getLastTimestamp()){
            progress.setLastTimestamp(dto.getLastTimestamp());
        }
        em.merge(progress);

        return Response.ok().build();
    }

    @GET
    @Path("/my")
    public List<UserLessonProgress> getMyProgress() {
        String userEmail = jwt.getSubject();
        if (userEmail == null || userEmail.isBlank()) {
            throw new NotAuthorizedException("No user email in JWT");
        }
        return em.createQuery("""
            SELECT p FROM UserLessonProgress p
            WHERE p.userEmail = :email
        """, UserLessonProgress.class)
                .setParameter("email", userEmail)
                .getResultList();
    }

    @GET
    @Path("/top-viewed")
    public List<LearningContentDto> getTopViewedLessons(@QueryParam("limit") @DefaultValue("3") int limit) {
        List<Object[]> result = em.createQuery("""
            SELECT lc, COUNT(DISTINCT p.userEmail)
            FROM UserLessonProgress p
            JOIN LearningContent lc ON lc.id = p.lessonId
            GROUP BY lc
            ORDER BY COUNT(DISTINCT p.userEmail) DESC
        """, Object[].class)
                .setMaxResults(limit)
                .getResultList();

        return result.stream()
                .map(r -> {
                    LearningContent lc = (LearningContent) r[0];
                    return LearningContentDto.fromEntity(lc);
                })
                .toList();
    }

    @GET
    @Path("/all")
    @RolesAllowed("admin")
    public List<ProgressDisplayDto> getAllUserProgress() {
        List<UserLessonProgress> progresses = em.createQuery(
                "SELECT p FROM UserLessonProgress p ORDER BY p.updatedAt DESC",
                UserLessonProgress.class
        ).getResultList();

        List<ProgressDisplayDto> result = new ArrayList<>();

        for (UserLessonProgress p : progresses) {
            if (p.getLessonId() == null || p.getLessonId().isBlank()) continue;

            LearningContent lesson = em.find(LearningContent.class, p.getLessonId().trim());
            if (lesson == null) continue;

            ProgressDisplayDto dto = new ProgressDisplayDto();
            dto.lessonId = lesson.getId();
            dto.lessonTitle = lesson.getTitle();
            dto.userEmail = p.getUserEmail();
            dto.percent = p.getPercent();
            dto.updatedAt = p.getUpdatedAt();
            result.add(dto);
        }

        return result;
    }

    public static class ProgressDisplayDto {
        public String lessonId;
        public String lessonTitle;
        public String userEmail;
        public int percent;
        public LocalDateTime updatedAt;
    }


    public static class ProgressDto {
        private int percent;
        private int lastTimestamp;

        public int getPercent() { return percent; }
        public void setPercent(int percent) { this.percent = percent; }

        public int getLastTimestamp() { return lastTimestamp; }
        public void setLastTimestamp(int lastTimestamp) { this.lastTimestamp = lastTimestamp; }
    }
}
