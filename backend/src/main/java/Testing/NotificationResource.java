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
import java.util.UUID;

@Path("/notifications")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class NotificationResource {

    @Inject EntityManager em;
    @Inject JsonWebToken jwt;

    @GET
    @RolesAllowed({ "user", "employee", "admin" })
    public Response getMyNotifications() {
        try {
            String email = jwt.getClaim("email");
            if (email == null || email.isBlank()) {
                return Response.status(Response.Status.UNAUTHORIZED).entity("No e-mail claim in JWT").build();
            }

            List<User> list = em.createQuery("SELECT u FROM User u WHERE u.email = :e", User.class)
                    .setParameter("e", email).getResultList();

            if (list.isEmpty()) {
                return Response.status(Response.Status.NOT_FOUND).entity("User not found for e-mail: " + email).build();
            }

            User me = list.get(0);

            List<NotificationDto> dtoList = em.createQuery("""
                SELECT n FROM Notification n 
                WHERE n.recipient = :me 
                ORDER BY n.createdAt DESC
            """, Notification.class)
                    .setParameter("me", me)
                    .getResultList()
                    .stream()
                    .map(NotificationDto::fromEntity)
                    .toList();

            return Response.ok(dtoList).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().entity("Internal error: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/all")
    @RolesAllowed("admin")
    public Response getAllNotifications() {
        try {
            List<NotificationDto> all = em.createQuery("""
                SELECT n FROM Notification n 
                ORDER BY n.createdAt DESC
            """, Notification.class)
                    .getResultList()
                    .stream()
                    .map(NotificationDto::fromEntity)
                    .toList();

            return Response.ok(all).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError()
                    .entity("Error fetching notifications: " + e.getMessage()).build();
        }
    }

    @DELETE
    @Transactional
    @RolesAllowed({ "user", "employee", "admin" })
    public Response deleteAllMyNotifications() {
        try {
            String email = jwt.getClaim("email");
            if (email == null || email.isBlank()) {
                return Response.status(Response.Status.UNAUTHORIZED).entity("No email claim in JWT").build();
            }

            User me = em.createQuery("SELECT u FROM User u WHERE u.email = :e", User.class)
                    .setParameter("e", email)
                    .getSingleResult();

            int deleted = em.createQuery("DELETE FROM Notification n WHERE n.recipient = :me")
                    .setParameter("me", me)
                    .executeUpdate();

            return Response.noContent().build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError()
                    .entity("Failed to delete notifications: " + e.getMessage())
                    .build();
        }
    }

    @PUT
    @Path("/{id}/read")
    @Transactional
    @RolesAllowed({ "user", "employee", "admin" })
    public Response markAsRead(@PathParam("id") String id) {
        Notification n = em.find(Notification.class, UUID.fromString(id));
        if (n == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        n.setRead(true);
        em.merge(n);
        return Response.noContent().build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @RolesAllowed({ "user", "employee", "admin" })
    public Response deleteNotification(@PathParam("id") String id) {
        Notification n = em.find(Notification.class, UUID.fromString(id));
        if (n == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        em.remove(n);
        return Response.noContent().build();
    }

    @PUT
    @Path("/read-all")
    @Transactional
    @RolesAllowed({ "user", "employee", "admin" })
    public Response markAllAsRead() {
        String email = jwt.getClaim("email");
        if (email == null || email.isBlank()) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("No e-mail claim in JWT").build();
        }

        List<User> users = em.createQuery("SELECT u FROM User u WHERE u.email = :e", User.class)
                .setParameter("e", email).getResultList();

        if (users.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
        }

        User me = users.get(0);

        int updated = em.createQuery("UPDATE Notification n SET n.read = true WHERE n.recipient = :me AND n.read = false")
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
            all.forEach(u -> persist(req.message, u));
            return Response.status(Response.Status.CREATED).build();
        }

        if ("USER".equalsIgnoreCase(req.target)) {
            if (req.userIds == null || req.userIds.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Target USER but userIds is empty")
                        .build();
            }

            int sent = 0;
            for (String id : req.userIds) {
                User u = em.find(User.class, id);
                if (u != null) {
                    persist(req.message, u);
                    sent++;
                }
            }

            return Response.status(Response.Status.CREATED)
                    .entity("Notification created for " + sent + " user(s)")
                    .build();
        }

        return Response.status(Response.Status.BAD_REQUEST)
                .entity("Invalid target: " + req.target)
                .build();
    }

    private void persist(String msg, User u) {
        Notification n = new Notification();
        n.setMessage(msg);
        n.setRecipient(u);
        n.setCreatedAt(LocalDateTime.now());
        em.persist(n);
    }

    public static class NotificationCreationReq {
        public String message;
        public String target;
        public List<String> userIds;

        @Override
        public String toString() {
            return "NotificationCreationReq{" +
                    "message='" + message + '\'' +
                    ", target='" + target + '\'' +
                    ", userIds=" + userIds +
                    '}';
        }
    }
}
