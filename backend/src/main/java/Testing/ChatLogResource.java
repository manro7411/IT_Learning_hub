package Testing;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.ChatLog;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.time.LocalDateTime;
import java.util.List;

@Path("/chatlog")
@PermitAll
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ChatLogResource {

    @Inject EntityManager em;
    @Inject JsonWebToken jwt;

    @POST
    @Transactional
    public Response save(ChatLog log) {
        String email = jwt.getSubject();

        if (email == null || email.isBlank()) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Missing user in JWT").build();
        }

        log.setUserEmail(email);

        if (log.getTimestamp() == null) {
            log.setTimestamp(LocalDateTime.now());
        }

        em.persist(log);
        return Response.status(Response.Status.CREATED).build();
    }

    @GET
    @Path("/all")
    public List<ChatLog> getAll() {
        return em.createQuery("SELECT c FROM ChatLog c ORDER BY c.timestamp DESC", ChatLog.class)
                .setMaxResults(100)
                .getResultList();
    }

    @GET
    @Path("/my")
    public List<ChatLog> getMyLogs() {
        String email = jwt.getSubject();

        if (email == null || email.isBlank()) {
            throw new NotAuthorizedException("Missing JWT user identity");
        }

        return em.createQuery("SELECT c FROM ChatLog c WHERE c.userEmail = :email ORDER BY c.timestamp DESC", ChatLog.class)
                .setParameter("email", email)
                .setMaxResults(100)
                .getResultList();
    }
}
