package Testing;

import QuizService.Entity.QuestionChoiceEntity;
import QuizService.Entity.QuestionEntity;
import QuizService.QuestionType;
import QuizService.ExtendedLearningContentDto;
import QuizService.QuestionDTO;
import QuizService.ChoiceDTO;
import dto.LearningContentDto;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.LearningContent;
import model.UserLessonProgress;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Path("/learning")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class LearningContentResource {

    @Inject EntityManager em;
    @Inject JsonWebToken jwt;

    @GET
    public List<LearningContentDto> list(@QueryParam("mine") @DefaultValue("false") boolean mine) {
        if (mine) {
            String email = jwt.getSubject();
            return em.createQuery("""
                    SELECT lc FROM LearningContent lc
                    WHERE lc.authorEmail = :email
                    ORDER BY lc.createdAt DESC
                    """, LearningContent.class)
                    .setParameter("email", email)
                    .getResultStream()
                    .map(LearningContentDto::fromEntity)
                    .toList();
        }
        return em.createQuery("""
                SELECT lc FROM LearningContent lc
                ORDER BY lc.createdAt DESC
                """, LearningContent.class)
                .getResultStream()
                .map(LearningContentDto::fromEntity)
                .toList();
    }

    @POST
    @Transactional
    @RolesAllowed("admin")
    public Response create(ExtendedLearningContentDto dto) {
        LearningContent lc = new LearningContent();
        lc.setId(UUID.randomUUID().toString().replace("-", "").substring(0, 21));
        lc.setTitle(dto.title);
        lc.setDescription(dto.description);
        lc.setCategory(dto.category);
        lc.setThumbnailUrl(dto.thumbnailUrl);
        lc.setAuthorName(jwt.getClaim("name"));
        lc.setAuthorEmail(jwt.getSubject());
        lc.setAuthorRole("admin");
        lc.setClickCount(0L);
        lc.setCreatedAt(LocalDateTime.now());
        lc.setMaxAttempts(Optional.ofNullable(dto.maxAttempts).orElse(1));

        lc.setAssignType(dto.assignType);
        lc.setAssignedUserIds(dto.assignedUserIds);
        lc.setAssignedTeamIds(dto.assignedTeamIds);
        lc.setDueDate(dto.dueDate);

        em.persist(lc);

        String quizId = UUID.randomUUID().toString().replace("-", "").substring(0, 21);
        if (dto.questions != null) {
            for (QuestionDTO q : dto.questions) {
                QuestionEntity qe = new QuestionEntity();
                qe.setId(UUID.randomUUID().toString().replace("-", "").substring(0, 21));
                qe.setLearningContent(lc);
                qe.setQuiz_id(quizId);
                qe.setQuestionText(q.questionText);
                qe.setType(QuestionType.valueOf(q.type.toUpperCase()));
                qe.setPoints(q.points != null ? q.points : 1);
                em.persist(qe);

                if (q.choices != null) {
                    for (ChoiceDTO c : q.choices) {
                        QuestionChoiceEntity ce = new QuestionChoiceEntity();
                        ce.id = UUID.randomUUID().toString().replace("-", "").substring(0, 21);
                        ce.question = qe;
                        ce.choiceText = c.text;
                        ce.isCorrect = c.isCorrect;
                        em.persist(ce);
                    }
                }
            }
        }

        return Response.created(URI.create("/learning/" + lc.getId()))
                .entity(LearningContentDto.fromEntity(lc))
                .build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    @RolesAllowed("admin")
    public LearningContentDto update(@PathParam("id") String id, LearningContentDto dto) {
        LearningContent lc = em.find(LearningContent.class, id);
        if (lc == null) throw new NotFoundException();

        lc.setTitle(dto.title());
        lc.setDescription(dto.description());
        lc.setCategory(dto.category());
        lc.setThumbnailUrl(dto.thumbnailUrl());
        lc.setAssignType(dto.assignType());
        lc.setAssignedUserIds(dto.assignedUserIds());
        lc.setAssignedTeamIds(dto.assignedTeamIds());

        if (dto.dueDate() != null) {
            lc.setDueDate(dto.dueDate());
        }

        return LearningContentDto.fromEntity(lc);
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @RolesAllowed("admin")
    public void delete(@PathParam("id") String id) {
        LearningContent lc = em.find(LearningContent.class, id);
        if (lc != null) em.remove(lc);
    }

    @GET
    @Path("/{id}")
    public LearningContentDto getOne(@PathParam("id") String id) {
        LearningContent lc = em.find(LearningContent.class, id);
        if (lc == null) throw new NotFoundException();
        return LearningContentDto.fromEntity(lc);
    }

    @POST
    @Path("/{id}/click")
    @Transactional
    @RolesAllowed("user")
    public void addClick(@PathParam("id") String lessonId) {
        String userEmail = jwt.getSubject();
        UserLessonProgress progress = em.createQuery(
                        "SELECT p FROM UserLessonProgress p WHERE p.lessonId = :lessonId AND p.userEmail = :userEmail",
                        UserLessonProgress.class)
                .setParameter("lessonId", lessonId)
                .setParameter("userEmail", userEmail)
                .getResultStream()
                .findFirst()
                .orElse(null);

        if (progress == null) {
            progress = new UserLessonProgress();
            progress.setLessonId(lessonId);
            progress.setUserEmail(userEmail);
            progress.setPercent(1);
            progress.setUpdatedAt(LocalDateTime.now());
            em.persist(progress);
        } else {
            progress.setPercent(Math.max(progress.getPercent(), 1));
            progress.setUpdatedAt(LocalDateTime.now());
        }

        int updated = em.createQuery("UPDATE LearningContent lc SET lc.clickCount = lc.clickCount + 1 WHERE lc.id = :id")
                .setParameter("id", lessonId)
                .executeUpdate();
        if (updated == 0) throw new NotFoundException();
    }

    @GET
    @Path("/{id}/click-count")
    public Long getClickCount(@PathParam("id") String id) {
        LearningContent lc = em.find(LearningContent.class, id);
        if (lc == null) throw new NotFoundException();
        return lc.getClickCount();
    }

    @GET
    @Path("/top-viewed")
    public List<LearningContentDto> topViewed(@QueryParam("limit") @DefaultValue("5") int limit) {
        return em.createQuery("""
                SELECT lc FROM LearningContent lc
                ORDER BY lc.clickCount DESC
                """, LearningContent.class)
                .setMaxResults(limit)
                .getResultStream()
                .map(LearningContentDto::fromEntity)
                .toList();
    }

    @GET
    @Path("/assigned-to-me")
    @RolesAllowed({"user", "admin"})
    public List<LearningContentDto> getAssignedToMe() {
        String userEmail = jwt.getSubject();

        List<String> myTeamIds = em.createQuery("""
            SELECT DISTINCT m.team.id FROM MemberEntity m
            WHERE m.userID = :userId
        """, String.class)
                .setParameter("userId", userEmail)
                .getResultList();

        List<LearningContent> lessons = em.createQuery("""
    SELECT lc FROM LearningContent lc
    WHERE
        lc.assignType = 'all'
        OR (lc.assignType = 'specific' AND :userId IN ELEMENTS(lc.assignedUserIds))
        OR (lc.assignType = 'team' AND EXISTS (
            SELECT 1 FROM LearningContent l2
            WHERE l2.id = lc.id AND EXISTS (
                SELECT teamId FROM LearningContent l3 JOIN l3.assignedTeamIds teamId
                WHERE teamId IN :teamIds
            )
        ))
    ORDER BY lc.createdAt DESC
""", LearningContent.class)
                .setParameter("userId", userEmail)
                .setParameter("teamIds", myTeamIds)
                .getResultList();

        return lessons.stream()
                .map(LearningContentDto::fromEntity)
                .toList();
    }
    @GET
    @Path("/upcoming-due")
    @RolesAllowed({"user", "admin"})
    public List<LearningContentDto> getUpcomingDue() {
        List<LearningContent> lessons = em.createQuery("""
        SELECT lc FROM LearningContent lc
        WHERE lc.dueDate IS NOT NULL
        ORDER BY lc.dueDate ASC
    """, LearningContent.class)
                .setMaxResults(20)
                .getResultList();

        return lessons.stream()
                .map(LearningContentDto::fromEntity)
                .toList();
    }
}
