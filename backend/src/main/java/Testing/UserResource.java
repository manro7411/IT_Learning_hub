package Testing;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

import jakarta.ws.rs.core.Response;
import model.User;
import util.JwtUtil;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    @Inject
    EntityManager em;

    @GET
    public List<User> getAllUsers() {
        return em.createQuery("SELECT u FROM User u", User.class)
                .getResultList();
    }

    @POST
    @Transactional
    public void createUser(User user) {
        em.persist(user);
    }

    @POST
    @Path("/login")
    @Transactional
    public Response login(User request) {
        try {
            User user = em.createQuery("SELECT u FROM User u WHERE u.email = :email", User.class)
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
