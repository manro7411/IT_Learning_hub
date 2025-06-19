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
import java.util.stream.Collectors;
@Path("/learning")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LearningContentResource {
    @Inject EntityManager em;
    @Inject JsonWebToken jwt;

    @GET
    public List<LearningContentDto> list() {
        return em.createQuery("SELECT lc FROM LearningContent lc", LearningContent.class)
                .getResultStream()
                .map(LearningContentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @POST
    @Transactional
    @RolesAllowed("admin")
    public Response create(LearningContentDto dto) {

        LearningContent lc = dto.toEntity();
        // ดึงชื่อ admin จาก token
        lc.setAuthorName(jwt.getClaim("name"));
        lc.setAuthorRole("Admin");

        em.persist(lc);
        return Response
                .created(URI.create("/learning/" + lc.getId()))
                .entity(LearningContentDto.fromEntity(lc))
                .build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    @RolesAllowed("admin")
    public LearningContentDto update(@PathParam("id") Long id, LearningContentDto dto) {
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
    public void delete(@PathParam("id") Long id) {
        LearningContent lc = em.find(LearningContent.class, id);
        if (lc != null) em.remove(lc);
    }
}
