package Testing;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.User;
import util.JwtUtil;

@Path("/login")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LoginResource {

    @Inject
    EntityManager em;

    @POST
    @Transactional
    public Response login(User request) {
        try {
            User user = em.createQuery(
                            "SELECT u FROM User u WHERE u.email = :email", User.class)
                    .setParameter("email", request.getEmail())
                    .getSingleResult();

            if (!user.getPassword().equals(request.getPassword())) {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity("Invalid password")
                        .build();
            }

            String token = JwtUtil.generateToken(user.getEmail(), user.getRole());


            return Response.ok().entity("{\"token\": \"" + token + "\"}").build();

        } catch (NoResultException e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("User not found")
                    .build();
        }
    }
}
