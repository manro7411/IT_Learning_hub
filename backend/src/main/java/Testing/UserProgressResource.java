package Testing;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.LearningContent;
import model.LearningScoreEntity;
import model.UserLessonProgress;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        return fetchProgressByEmail(userEmail);
    }

    @GET
    @Path("/all")
    @RolesAllowed({"admin","user"})
    public List<UserCourseProgressDto> getAllProgress() {
        List<UserLessonProgress> progresses = em.createQuery("""
                SELECT p FROM UserLessonProgress p
                ORDER BY p.updatedAt DESC
                """, UserLessonProgress.class).getResultList();

        return buildProgressDtoList(progresses);
    }

    private List<UserCourseProgressDto> fetchProgressByEmail(String email) {
        List<UserLessonProgress> progresses = em.createQuery("""
                SELECT p FROM UserLessonProgress p
                WHERE p.userEmail = :email
                ORDER BY p.updatedAt DESC
                """, UserLessonProgress.class)
                .setParameter("email", email)
                .getResultList();

        return buildProgressDtoList(progresses);
    }

    private List<UserCourseProgressDto> buildProgressDtoList(List<UserLessonProgress> progresses) {
        List<UserCourseProgressDto> result = new ArrayList<>();
        for (UserLessonProgress p : progresses) {
            if (p.getLessonId() == null || p.getLessonId().isBlank()) continue;
            LearningContent lesson = em.find(LearningContent.class, p.getLessonId().trim());
            if (lesson == null) continue;

            var dto = new UserCourseProgressDto();
            dto.lessonId = lesson.getId();
            dto.lessonTitle = Optional.ofNullable(lesson.getTitle()).orElse("Untitled");
            dto.percent = Optional.ofNullable(p.getPercent()).orElse(0);
            dto.score = Optional.ofNullable(p.getScore()).orElse(0);
            dto.attempts = Optional.ofNullable(p.getAttempts()).orElse(0);
            dto.maxAttempts = Optional.ofNullable(lesson.getMaxAttempts()).orElse(1);
            dto.userEmail = p.getUserEmail();
            dto.lastTimestamp = p.getLastTimestamp();
            dto.thumbnailUrl = p.getThumbnailUrl();

            result.add(dto);
        }
        return result;
    }
    @PUT
    @Path("/{lessonId}/submit-score")
    @Transactional
    public Response submitScore(@PathParam("lessonId") String lessonId, SubmitScoreRequest req) {
        String userEmail = jwt.getSubject();

        var progress = em.createQuery("""
        SELECT p FROM UserLessonProgress p
        WHERE p.lessonId = :lessonId AND p.userEmail = :userEmail
        """, UserLessonProgress.class)
                .setParameter("lessonId", lessonId)
                .setParameter("userEmail", userEmail)
                .getResultStream()
                .findFirst()
                .orElseThrow(() -> new NotFoundException("No progress found. Please watch the lesson first."));

        if (progress.getPercent() < 100) {
            throw new BadRequestException("You must complete the lesson (100%) before submitting score");
        }

        LearningContent lesson = em.find(LearningContent.class, lessonId);
        if (lesson == null) throw new NotFoundException("Lesson not found.");

        int maxAttempts = Optional.ofNullable(lesson.getMaxAttempts()).orElse(1);
        int currentAttempts = Optional.ofNullable(progress.getAttempts()).orElse(0);

        if (currentAttempts >= maxAttempts) {
            throw new BadRequestException("You have reached the maximum number of attempts for this quiz.");
        }

        int score = req.score;
        int totalQuestions = req.totalQuestions;
        int percentScore = (int) Math.round((score * 100.0) / totalQuestions);

        int levelScore;
        if (percentScore >= 100) {
            levelScore = 5;
        } else if (percentScore >=80) {
            levelScore = 4;
        }else if (percentScore >=70) {
            levelScore = 3;
        }else if (percentScore >=60) {
            levelScore = 2;
        }else if (percentScore >=50) {
            levelScore = 1;
        }else {
            levelScore = 0;
        }

        System.out.println("Incoming score: " + score);
        System.out.println("Incoming PercentScore:"+percentScore);
        System.out.println("Incoming LevelScore:"+levelScore);

        progress.setAttempts(currentAttempts + 1);
        progress.setScore(score);
        progress.setTotalQuestions(totalQuestions);
        progress.setUpdatedAt(LocalDateTime.now());

        LearningScoreEntity learningScore = new LearningScoreEntity();
        learningScore.setLessonId(lessonId);
        learningScore.setUserEmail(userEmail);
        learningScore.setOverallScore(levelScore);
        learningScore.setUpdatedAt(LocalDateTime.now());

        em.persist(learningScore);
        System.out.println("LearningScore persisted: " + learningScore);

        return Response.ok().build();
    }

    @GET
    @Path("/scores/total")
    @Transactional
    public Response total() {
        String userEmail = jwt.getSubject();

        Long totalScore = em.createQuery("""
        SELECT SUM(s.overallScore)
        FROM LearningScoreEntity s
        WHERE s.userEmail = :email
        """, Long.class)
                .setParameter("email", userEmail)
                .getSingleResult();
        return Response.ok(new TotalScoreDto(userEmail,totalScore.intValue())).build();
    }

    public static class TotalScoreDto {
        public String userEmail;
        public int overallScore;

        public TotalScoreDto(String userEmail, int overallScore) {
            this.userEmail = userEmail;
            this.overallScore = overallScore;
        }
    }


    @PUT
    @Path("/{lessonId}")
    @Transactional
    public Response updateProgress(@PathParam("lessonId") String lessonId, UpdateProgressRequest req) {
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
                    em.persist(newProgress);
                    return newProgress;
                });

        progress.setPercent(req.percent);
        progress.setLastTimestamp(Optional.ofNullable(req.lastTimestamp).orElse(0));
        progress.setUpdatedAt(LocalDateTime.now());
        progress.setThumbnailUrl(req.thumbnailUrl);

        if (req.percent == 100){
            System.out.println("You have reached the maximum number of attempts for this question.");
        }

        return Response.ok().build();
    }

    public static class UserCourseProgressDto {
        public String lessonId;
        public String thumbnailUrl;
        public String lessonTitle;
        public int percent;
        public int score;
        public int attempts;
        public int maxAttempts;
        public String userEmail;
        public int lastTimestamp;
    }

    public static class SubmitScoreRequest {
        public int score;
        public int totalQuestions;
    }

    public static class UpdateProgressRequest {
        public int percent;
        public String thumbnailUrl;
        public Integer lastTimestamp;
    }
}
