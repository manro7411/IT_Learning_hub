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

/**
 * REST endpoint สำหรับดึง–สร้าง Notifications
 */
@Path("/notifications")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class NotificationResource {

    @Inject EntityManager em;
    @Inject JsonWebToken  jwt;

    /* ─────────────────────────────────────────────
     *  GET  /notifications   – ผู้ใช้ดึงแจ้งเตือนตัวเอง
     * ───────────────────────────────────────────── */
    @GET
    @RolesAllowed({ "user", "employee", "admin" })
    public Response getMyNotifications() {
        try {
            String email = jwt.getClaim("email");
            System.out.println("📥  GET /notifications  email = " + email);

            if (email == null || email.isBlank()) {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity("No e-mail claim in JWT")
                        .build();
            }

            /* หา user */
            List<User> list = em.createQuery(
                            "SELECT u FROM User u WHERE u.email = :e", User.class)
                    .setParameter("e", email)
                    .getResultList();

            if (list.isEmpty()) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("User not found for e-mail: " + email)
                        .build();
            }

            User me = list.get(0);

            /* ดึง notification */
            List<NotificationDto> dtoList = em.createQuery(
                            "SELECT n FROM Notification n " +
                                    "WHERE n.recipient = :me " +
                                    "ORDER BY n.createdAt DESC", Notification.class)
                    .setParameter("me", me)
                    .getResultList()
                    .stream()
                    .map(NotificationDto::fromEntity)
                    .toList();

            return Response.ok(dtoList).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Internal error: " + e.getMessage())
                    .build();
        }
    }

    /* ─────────────────────────────────────────────
     *  POST /notifications   – Admin ส่งแจ้งเตือน
     * ───────────────────────────────────────────── */
    @POST
    @Transactional
    @RolesAllowed("admin")
    public Response createNotification(NotificationCreationReq req) {

        System.out.println("📨 [CREATE NOTIFICATION] " + req);

        /* validate */
        if (req == null || req.message == null || req.message.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Message must not be empty")
                    .build();
        }

        /* ส่งถึงทุกคน */
        if ("ALL".equalsIgnoreCase(req.target)) {
            List<User> all = em.createQuery("SELECT u FROM User u", User.class)
                    .getResultList();
            System.out.println("→ Send to ALL: " + all.size());
            all.forEach(u -> persist(req.message, u));
            return Response.status(Response.Status.CREATED).build();
        }

        /* ส่งเฉพาะราย */
        if ("USER".equalsIgnoreCase(req.target)) {
            if (req.userIds == null || req.userIds.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Target USER but userIds is empty")
                        .build();
            }

            int sent = 0;
            for (String id : req.userIds) {
                System.out.println("🔍 Looking up userId = " + id);
                User u = em.find(User.class, id);
                if (u != null) {
                    persist(req.message, u);
                    sent++;
                } else {
                    System.err.println("❌  User not found: " + id);
                }
            }
            return Response.status(Response.Status.CREATED)
                    .entity("Notification created for " + sent + " user(s)")
                    .build();
        }

        /* target ไม่ถูกต้อง */
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("Invalid target: " + req.target)
                .build();
    }

    /* helper – save & flush */
    private void persist(String msg, User u) {
        Notification n = new Notification();
        n.setMessage(msg);
        n.setRecipient(u);
        n.setCreatedAt(LocalDateTime.now());
        em.persist(n);
        em.flush();                               // force write to DB
        System.out.println("✅  Saved for " + u.getEmail());
    }

    /* ──────────── request body ──────────── */
    public static class NotificationCreationReq {
        public String       message;
        public String       target;      // "ALL" | "USER"
        public List<String> userIds;     // ส่งเมื่อ target == USER

        @Override public String toString() {
            return "NotificationCreationReq{" +
                    "message='" + message + '\'' +
                    ", target='" + target + '\'' +
                    ", userIds=" + userIds +
                    '}';
        }
    }
}
