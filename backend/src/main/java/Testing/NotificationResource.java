package Testing;

import dto.NotificationDto;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Notification;
import model.User;
import org.eclipse.microprofile.jwt.JsonWebToken;
import java.time.LocalDateTime;
import java.util.List;
@Path("/notifications")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class NotificationResource {

    @Inject EntityManager em;
    @Inject JsonWebToken  jwt;

    @GET
    @RolesAllowed({ "user", "employee", "admin" })
    public List<NotificationDto> getMyNotifications() {
        String email = jwt.getClaim("email");
        User me = em.createQuery(
                        "SELECT u FROM User u WHERE u.email = :e", User.class)
                .setParameter("e", email)
                .getSingleResult();

        return em.createQuery(
                        "SELECT n FROM Notification n WHERE n.recipient = :me ORDER BY n.createdAt DESC",
                        Notification.class)
                .setParameter("me", me)
                .getResultList()
                .stream()
                .map(NotificationDto::fromEntity)
                .toList();
    }
    @POST
    @Transactional
    @RolesAllowed("admin")
    public Response createNotification(NotificationCreationReq req) {

        if (req == null || req.message == null || req.message.isBlank())
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Message must not be empty").build();

        if ("ALL".equalsIgnoreCase(req.target)) {
            em.createQuery("SELECT u FROM User u", User.class)
                    .getResultList()
                    .forEach(u -> persist(req.message, u));
        }
        else if ("USER".equalsIgnoreCase(req.target) && req.userIds != null) {
            for (Long id : req.userIds) {
                User u = em.find(User.class, id);
                if (u != null) persist(req.message, u);
            }
        } else {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid target or userIds").build();
        }
        return Response.status(Response.Status.CREATED).build();
    }

    private void persist(String msg, User u) {
        Notification n = new Notification();
        n.setMessage(msg);
        n.setRecipient(u);
        n.setCreatedAt(LocalDateTime.now());
        em.persist(n);
    }

    public static class NotificationCreationReq {
        public String         message;
        public String         target;
        public List<Long>     userIds;
    }
}
