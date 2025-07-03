package Testing;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import model.LearningContent;
import model.UserLessonProgress;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Path("/user/progress")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({"user", "admin"})
public class UserProgressResource {

    @Inject EntityManager em;
    @Inject JsonWebToken jwt;

    @GET
    public List<UserCourseProgressDto> getMyProgress() {
        String userEmail = jwt.getSubject();

        List<UserLessonProgress> progresses = em.createQuery("""
                SELECT p FROM UserLessonProgress p
                WHERE p.userEmail = :email
                ORDER BY p.updatedAt DESC
                """, UserLessonProgress.class)
                .setParameter("email", userEmail)
                .getResultList();

        List<UserCourseProgressDto> result = new ArrayList<>();

        for (UserLessonProgress p : progresses) {
            if (p.getLessonId() == null || p.getLessonId().isBlank()) continue;

            LearningContent lesson = em.find(LearningContent.class, p.getLessonId().trim());
            if (lesson == null) continue;

            var dto = new UserCourseProgressDto();
            dto.lessonId = lesson.getId();
            dto.lessonTitle = lesson.getTitle() != null ? lesson.getTitle().trim() : "Untitled";
            dto.percent = p.getPercent() != null ? p.getPercent() : 0;
            dto.score = p.getScore() != null ? p.getScore() : 0;

            result.add(dto);
        }

        return result;
    }

    @PUT
    @Path("/{lessonId}/submit-score")
    @Transactional
    public void submitScore(@PathParam("lessonId") String lessonId, SubmitScoreRequest req) {
        String userEmail = jwt.getSubject();

        var progress = em.createQuery("""
                SELECT p FROM UserLessonProgress p
                WHERE p.lessonId = :lessonId AND p.userEmail = :userEmail
                """, UserLessonProgress.class)
                .setParameter("lessonId", lessonId)
                .setParameter("userEmail", userEmail)
                .getResultStream()
                .findFirst()
                .orElseGet(() -> {
                    var newProgress = new UserLessonProgress();
                    newProgress.setLessonId(lessonId);
                    newProgress.setUserEmail(userEmail);
                    newProgress.setPercent(100);
                    newProgress.setUpdatedAt(LocalDateTime.now());
                    em.persist(newProgress);
                    return newProgress;
                });

        progress.setScore(req.score);
        progress.setUpdatedAt(LocalDateTime.now());
    }

    @PUT
    @Path("/{lessonId}")
    @Transactional
    public void updateProgress(@PathParam("lessonId") String lessonId, UpdateProgressRequest req) {
        String userEmail = jwt.getSubject();

        var progress = em.createQuery("""
                SELECT p FROM UserLessonProgress p
                WHERE p.lessonId = :lessonId AND p.userEmail = :userEmail
                """, UserLessonProgress.class)
                .setParameter("lessonId", lessonId)
                .setParameter("userEmail", userEmail)
                .getResultStream()
                .findFirst()
                .orElseGet(() -> {
                    var newProgress = new UserLessonProgress();
                    newProgress.setLessonId(lessonId);
                    newProgress.setUserEmail(userEmail);
                    newProgress.setUpdatedAt(LocalDateTime.now());
                    em.persist(newProgress);
                    return newProgress;
                });

        progress.setPercent(req.percent);
        progress.setLastTimestamp(req.lastTimestamp != null ? req.lastTimestamp : 0);
        progress.setUpdatedAt(LocalDateTime.now());
    }

    public static class UserCourseProgressDto {
        public String lessonId;
        public String lessonTitle;
        public int percent;
        public int score;
    }

    public static class SubmitScoreRequest {
        public int score;
    }

    public static class UpdateProgressRequest {
        public int percent;
        public Integer lastTimestamp;
    }
}
