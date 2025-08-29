package Testing;

import dto.FeedbackDTO;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.LearningContent;
import model.UserFeedbackEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Path("/feedback")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserFeedbackResource {

    @PersistenceContext
    EntityManager em;

    @GET
    public List<UserFeedbackEntity> getAllFeedback() {
        return em.createQuery("SELECT f FROM UserFeedbackEntity f", UserFeedbackEntity.class)
                .getResultList();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response createFeedback(UserFeedbackEntity feedback) {

        try {
            if (feedback.getLearningContent() == null || feedback.getLearningContent().getId() == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Learning content ID is required").build();
            }

            LearningContent learningContent = em.find(LearningContent.class, feedback.getLearningContent().getId());
            if (learningContent == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Invalid learning content ID").build();
            }

            feedback.setRatingScore(feedback.getRatingScore());
            feedback.setLearningContent(learningContent);
            feedback.setCreatedAt(LocalDateTime.now());
            em.persist(feedback);
            System.out.println("Result information"+feedback);
            System.out.println("Saved feedback: " + feedback.getFeedback() + ", Rating: " + feedback.getRatingScore());

            return Response.status(Response.Status.CREATED).entity(new FeedbackDTO(feedback)).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("An error occurred: " + e.getMessage()).build();
        }
    }
    @GET
    @Path("/lesson/{lessonId}")
    public Response getFeedbackByLessonId(@PathParam("lessonId") String lessonId) {
        List<UserFeedbackEntity> feedbackList = em.createQuery(
                        "SELECT f FROM UserFeedbackEntity f WHERE f.learningContent.id = :lessonId", UserFeedbackEntity.class)
                .setParameter("lessonId", lessonId)
                .getResultList();

        if (feedbackList.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).entity("No feedback found for this lesson ID").build();
        }

        List<FeedbackDTO> simplified = feedbackList.stream()
                .map(FeedbackDTO::new)
                .toList();

        return Response.ok(simplified).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteFeedback(@PathParam("id") UUID id) {
        UserFeedbackEntity feedback = em.find(UserFeedbackEntity.class, id);
        if (feedback != null) {
            em.remove(feedback);
            return Response.noContent().build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }
}
