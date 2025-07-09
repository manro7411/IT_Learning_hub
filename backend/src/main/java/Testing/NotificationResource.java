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
import model.MemberEntity;
import org.eclipse.microprofile.jwt.JsonWebToken;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Path("/notifications")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class NotificationResource {

    @Inject EntityManager em;
    @Inject JsonWebToken jwt;

    @GET
    @RolesAllowed({"user", "employee", "admin"})
    public Response getMyNotifications() {
        String email = jwt.getClaim("email");
        if (email == null || email.isBlank()) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("No e-mail claim in JWT").build();
        }

        User me = em.createQuery("SELECT u FROM User u WHERE u.email = :e", User.class)
                .setParameter("e", email).getResultStream().findFirst()
                .orElseThrow(() -> new NotFoundException("User not found for e-mail: " + email));

        List<NotificationDto> dtoList = em.createQuery("""
                SELECT n FROM Notification n 
                WHERE n.recipient = :me 
                ORDER BY n.createdAt DESC
            """, Notification.class)
                .setParameter("me", me)
                .getResultStream()
                .map(NotificationDto::fromEntity)
                .toList();

        return Response.ok(dtoList).build();
    }

    @GET
    @Path("/all")
    @RolesAllowed("admin")
    public Response getAllNotifications() {
        List<NotificationDto> all = em.createQuery("""
                SELECT n FROM Notification n 
                ORDER BY n.createdAt DESC
            """, Notification.class)
                .getResultStream()
                .map(NotificationDto::fromEntity)
                .toList();

        return Response.ok(all).build();
    }

    @DELETE
    @Transactional
    @RolesAllowed({"user", "employee", "admin"})
    public Response deleteAllMyNotifications() {
        String email = jwt.getClaim("email");
        if (email == null || email.isBlank()) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("No email claim in JWT").build();
        }

        User me = em.createQuery("SELECT u FROM User u WHERE u.email = :e", User.class)
                .setParameter("e", email)
                .getSingleResult();

        em.createQuery("DELETE FROM Notification n WHERE n.recipient = :me")
                .setParameter("me", me)
                .executeUpdate();

        return Response.noContent().build();
    }

    @PUT
    @Path("/{id}/read")
    @Transactional
    @RolesAllowed({"user", "employee", "admin"})
    public Response markAsRead(@PathParam("id") String id) {
        Notification n = em.find(Notification.class, UUID.fromString(id));
        if (n == null) return Response.status(Response.Status.NOT_FOUND).build();

        n.setRead(true);
        return Response.noContent().build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @RolesAllowed({"user", "employee", "admin"})
    public Response deleteNotification(@PathParam("id") String id) {
        Notification n = em.find(Notification.class, UUID.fromString(id));
        if (n == null) return Response.status(Response.Status.NOT_FOUND).build();

        em.remove(n);
        return Response.noContent().build();
    }

    @PUT
    @Path("/read-all")
    @Transactional
    @RolesAllowed({"user", "employee", "admin"})
    public Response markAllAsRead() {
        String email = jwt.getClaim("email");
        if (email == null || email.isBlank()) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("No e-mail claim in JWT").build();
        }

        User me = em.createQuery("SELECT u FROM User u WHERE u.email = :e", User.class)
                .setParameter("e", email).getSingleResult();

        int updated = em.createQuery("""
                UPDATE Notification n SET n.read = true 
                WHERE n.recipient = :me AND n.read = false
            """)
                .setParameter("me", me)
                .executeUpdate();

        return Response.ok("Marked " + updated + " notifications as read").build();
    }

    @POST
    @Transactional
    @RolesAllowed("admin")
    public Response createNotification(NotificationCreationReq req) {
        if (req == null || req.message == null || req.message.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Message must not be empty").build();
        }

        if ("ALL".equalsIgnoreCase(req.target)) {
            List<User> all = em.createQuery("SELECT u FROM User u", User.class).getResultList();
            all.forEach(u -> persist(req.message, u,req.target));
            return Response.status(Response.Status.CREATED).build();
        }

        if ("USER".equalsIgnoreCase(req.target)) {
            if (req.userIds == null || req.userIds.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Target USER but userIds is empty").build();
            }

            req.userIds.forEach(id -> {
                User u = em.find(User.class, id);
                if (u != null) persist(req.message, u,req.target);
            });

            return Response.status(Response.Status.CREATED).entity("Notification created for users").build();
        }

        if ("TEAM".equalsIgnoreCase(req.target)) {
            if (req.teamIds == null || req.teamIds.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Target TEAM but teamIds is empty").build();
            }

            Set<String> userIds = em.createQuery("""
                    SELECT DISTINCT m.userID FROM MemberEntity m
                    WHERE m.team.id IN :teamIds
                """, String.class)
                    .setParameter("teamIds", req.teamIds)
                    .getResultStream()
                    .collect(Collectors.toSet());

            userIds.forEach(userId -> {
                User u = em.find(User.class, userId);
                if (u != null) persist(req.message, u, req.target);
            });

            return Response.status(Response.Status.CREATED).entity("Notification created for team members").build();
        }

        return Response.status(Response.Status.BAD_REQUEST).entity("Invalid target: " + req.target).build();
    }

    private void persist(String msg, User u,String target) {
        Notification n = new Notification();
        n.setMessage(msg);
        n.setRecipient(u);
        n.setTarget(target);
        n.setCreatedAt(LocalDateTime.now());
        em.persist(n);
    }

    public static class NotificationCreationReq {
        public String message;
        public String target;
        public List<String> userIds;
        public List<String> teamIds;
    }
}
