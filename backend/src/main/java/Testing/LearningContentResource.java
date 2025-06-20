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
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.net.URI;
import java.util.List;

@Path("/learning")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class LearningContentResource {

    @Inject EntityManager em;
    @Inject JsonWebToken jwt;                     // ▸ sub = email, name = display-name

    /* ─────────────────────────────────────────────
     *  1) LIST  (ทั้งหมด หรือเฉพาะของตัวเอง)
     *    GET /learning            → all
     *    GET /learning?mine=true  → เฉพาะของผู้เรียก
     * ───────────────────────────────────────────── */
    @GET
    public List<LearningContentDto> list(
            @QueryParam("mine") @DefaultValue("false") boolean mine) {

        if (mine) {                              // คืนเฉพาะ content ของตัวเอง
            String email = jwt.getSubject();     // email จาก JWT
            return em.createQuery("""
                    SELECT lc
                      FROM LearningContent lc
                     WHERE lc.authorEmail = :email
                     ORDER BY lc.createdAt DESC
                   """, LearningContent.class)
                    .setParameter("email", email)
                    .getResultStream()
                    .map(LearningContentDto::fromEntity)
                    .toList();
        }

        // default = ทุกคอร์ส
        return em.createQuery("""
                FROM LearningContent lc
                ORDER BY lc.createdAt DESC
               """, LearningContent.class)
                .getResultStream()
                .map(LearningContentDto::fromEntity)
                .toList();
    }

    /* ─────────────────────────────────────────────
     *  2) CREATE  (admin เท่านั้น)
     * ───────────────────────────────────────────── */
    @POST
    @Transactional
    @RolesAllowed("admin")
    public Response create(LearningContentDto dto) {

        LearningContent lc = dto.toEntity();
        lc.setAuthorName(jwt.getClaim("name"));
        lc.setAuthorEmail(jwt.getSubject());     // 🆕 เก็บ email
        lc.setAuthorRole("admin");

        em.persist(lc);

        return Response
                .created(URI.create("/learning/" + lc.getId()))
                .entity(LearningContentDto.fromEntity(lc))
                .build();
    }

    /* ─────────────────────────────────────────────
     *  3) UPDATE  (admin)
     * ───────────────────────────────────────────── */
    @PUT
    @Path("/{id}")
    @Transactional
    @RolesAllowed("admin")
    public LearningContentDto update(@PathParam("id") Long id,
                                     LearningContentDto dto) {

        LearningContent lc = em.find(LearningContent.class, id);
        if (lc == null) throw new NotFoundException();

        lc.setTitle(dto.title());
        lc.setDescription(dto.description());
        lc.setCategory(dto.category());
        lc.setThumbnailUrl(dto.thumbnailUrl());

        return LearningContentDto.fromEntity(lc);
    }

    /* ─────────────────────────────────────────────
     *  4) DELETE  (admin)
     * ───────────────────────────────────────────── */
    @DELETE
    @Path("/{id}")
    @Transactional
    @RolesAllowed("admin")
    public void delete(@PathParam("id") Long id) {
        LearningContent lc = em.find(LearningContent.class, id);
        if (lc != null) em.remove(lc);
    }

    /* ─────────────────────────────────────────────
     *  5) GET ONE  (public)
     * ───────────────────────────────────────────── */
    @GET
    @Path("/{id}")
    public LearningContentDto getOne(@PathParam("id") Long id) {
        LearningContent lc = em.find(LearningContent.class, id);
        if (lc == null) throw new NotFoundException();
        return LearningContentDto.fromEntity(lc);
    }
}
