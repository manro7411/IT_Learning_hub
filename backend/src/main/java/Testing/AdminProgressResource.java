package Testing;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import model.LearningContent;
import model.UserLessonProgress;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.ArrayList;
import java.util.List;

@Path("/admin/progress")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("admin")
public class AdminProgressResource {

    @Inject
    EntityManager em;
    @Inject
    JsonWebToken jwt;

    @GET
    public List<CourseProgressDto> getAllProgressForMyCourses() {
        String adminEmail = jwt.getSubject();


        List<LearningContent> myCourses = em.createQuery(
                        "SELECT lc FROM LearningContent lc WHERE lc.authorEmail = :email", LearningContent.class)
                .setParameter("email", adminEmail)
                .getResultList();

        if (myCourses.isEmpty()) return List.of();


        List<CourseProgressDto> result = new ArrayList<>();

        for (LearningContent course : myCourses) {
            List<UserLessonProgress> progresses = em.createQuery(
                            "SELECT p FROM UserLessonProgress p WHERE p.lessonId = :lessonId", UserLessonProgress.class)
                    .setParameter("lessonId", course.getId())
                    .getResultList();

            for (UserLessonProgress p : progresses) {
                CourseProgressDto dto = new CourseProgressDto();
                dto.lessonId = course.getId();
                dto.lessonTitle = course.getTitle();
                dto.userEmail = p.getUserEmail();
                dto.percent = p.getPercent();
                result.add(dto);
            }
        }

        return result;
    }

    public static class CourseProgressDto {
        public Long lessonId;
        public String lessonTitle;
        public String userEmail;
        public int percent;
    }
}
