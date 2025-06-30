package Testing;

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
    public Response create(LearningContentDto dto) {
        LearningContent lc = dto.toEntity();
        if (lc.getId() == null || lc.getId().isBlank()) {
            lc.setId(UUID.randomUUID().toString().replace("-", "").substring(0, 21));
        }
        lc.setAuthorName(jwt.getClaim("name"));
        lc.setAuthorEmail(jwt.getSubject());
        lc.setAuthorRole("admin");
        lc.setClickCount(0L);
        lc.setCreatedAt(LocalDateTime.now());
        em.persist(lc);
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

        // 🔍 ค้นหา progress ของผู้ใช้สำหรับบทเรียนนี้
        UserLessonProgress progress = em.createQuery(
                        "SELECT p FROM UserLessonProgress p WHERE p.lessonId = :lessonId AND p.userEmail = :userEmail",
                        UserLessonProgress.class
                ).setParameter("lessonId", lessonId)
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

        // ✅ เพิ่ม click count
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
}
