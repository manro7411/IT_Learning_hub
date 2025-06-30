package Testing;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import model.UserLessonProgress;
import model.LearningContent;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Path("/user/progress")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("user")
public class UserProgressResource {

    @Inject
    EntityManager em;

    @Inject
    JsonWebToken jwt;

    @GET
    public List<UserCourseProgressDto> getMyProgress() {
        String userEmail = jwt.getSubject();

        List<UserLessonProgress> progresses = em.createQuery(
                "SELECT p FROM UserLessonProgress p WHERE p.userEmail = :email ORDER BY p.updatedAt DESC",
                UserLessonProgress.class
        ).setParameter("email", userEmail).getResultList();

        List<UserCourseProgressDto> result = new ArrayList<>();

        for (UserLessonProgress p : progresses) {
            if (p.getLessonId() == null || p.getLessonId().isBlank()) continue;

            LearningContent lesson = em.find(LearningContent.class, p.getLessonId().trim());
            if (lesson == null) continue;

            UserCourseProgressDto dto = new UserCourseProgressDto();
            dto.lessonId = lesson.getId().trim();
            dto.lessonTitle = lesson.getTitle() != null ? lesson.getTitle().trim() : "Untitled";
            dto.percent = p.getPercent() != null ? p.getPercent() : 0;

            result.add(dto);
        }

        return result;
    }

    public static class UserCourseProgressDto {
        public String lessonId;
        public String lessonTitle;
        public int percent;
    }
}
