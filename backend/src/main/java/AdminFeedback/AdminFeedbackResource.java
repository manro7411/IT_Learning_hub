package AdminFeedback;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Path("/user/feedback")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Transactional
public class AdminFeedbackResource {

    @Inject
    EntityManager em;

    @GET
    public Response getAdminFeedback() {
        List<feedbackEntity> feedbackEntities = em.createQuery("SELECT f FROM feedbackEntity f", feedbackEntity.class).getResultList();

        List<AdminFeedbackDTO> feedbackDTOs = feedbackEntities.stream().map(entity ->
                new AdminFeedbackDTO(
                        entity.getId(),
                        entity.getLessonId(),
                        entity.getUserEmail(),
                        entity.getAdminEmail(),
                        entity.getFeedback(),
                        entity.getCreatedAt(),
                        entity.getSeen()
                )
        ).collect(Collectors.toList());

        return Response.ok(feedbackDTOs).build();
    }

    @POST
    public Response feedback(AdminFeedbackDTO dto) {
        feedbackEntity entity = new feedbackEntity();
        entity.setLessonId(dto.getLessonId());
        entity.setUserEmail(dto.getUserEmail());
        entity.setAdminEmail(dto.getAdminEmail());
        entity.setFeedback(dto.getFeedback());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setSeen(false);

        em.persist(entity);

        return Response.status(Response.Status.CREATED).entity("Feedback submitted successfully").build();
    }
}
