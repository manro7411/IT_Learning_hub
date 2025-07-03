package QuizService;

import QuizService.Entity.QuestionEntity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import model.LearningContent;

import java.util.ArrayList;
import java.util.List;

@Path("/questions")
@ApplicationScoped
public class QuestionResources {

    @Inject
    EntityManager em;

    @GET
    @Path("/all")
    public List<QuestionEntity> getQuestions() {
        List<QuestionEntity> questions = new ArrayList<>();
        return em.createQuery("SELECT q FROM QuestionEntity q", QuestionEntity.class)
                .getResultList();
    }

    @GET
    @Path("/by-learning/{contentId}")
    public List<QuestionEntity> getQuestionsByLearningContent(@PathParam("contentId") String contentId) {
        return em.createQuery(
                        "SELECT q FROM QuestionEntity q WHERE q.learningContent.id = :contentId",
                        QuestionEntity.class
                )
                .setParameter("contentId", contentId)
                .getResultList();
    }

}
