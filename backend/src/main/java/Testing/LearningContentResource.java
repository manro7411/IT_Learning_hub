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
    @Inject JsonWebToken jwt;

    /* ─────────────── 1) LIST ─────────────── */
    @GET
    public List<LearningContentDto> list(
            @QueryParam("mine") @DefaultValue("false") boolean mine) {

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
        SELECT lc FROM model.LearningContent lc
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
        lc.setAuthorName(jwt.getClaim("name"));
        lc.setAuthorEmail(jwt.getSubject());
        lc.setAuthorRole("admin");

        em.persist(lc);

        return Response
                .created(URI.create("/learning/" + lc.getId()))
                .entity(LearningContentDto.fromEntity(lc))
                .build();
    }

    /* ─────────────── 3) UPDATE ─────────────── */
    @PUT
    @Path("/{id}")
    @Transactional
    @RolesAllowed("admin")
    public LearningContentDto update(@PathParam("id") String id,
                                     LearningContentDto dto) {
        LearningContent lc = em.find(LearningContent.class, id);
        if (lc == null) throw new NotFoundException();

        lc.setTitle(dto.title());
        lc.setDescription(dto.description());
        lc.setCategory(dto.category());
        lc.setThumbnailUrl(dto.thumbnailUrl());

        return LearningContentDto.fromEntity(lc);
    }

    /* ─────────────── 4) DELETE ─────────────── */
    @DELETE
    @Path("/{id}")
    @Transactional
    @RolesAllowed("admin")
    public void delete(@PathParam("id") String id) {
        LearningContent lc = em.find(LearningContent.class, id);
        if (lc != null) em.remove(lc);
    }

    /* ─────────────── 5) GET ONE ─────────────── */
    @GET
    @Path("/{id}")
    public LearningContentDto getOne(@PathParam("id") String id) {
        LearningContent lc = em.find(LearningContent.class, id);
        if (lc == null) throw new NotFoundException();
        return LearningContentDto.fromEntity(lc);
    }
}