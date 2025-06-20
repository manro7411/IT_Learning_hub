package Testing;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
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
    public Response login(LoginRequest request) {
        System.out.println("🔐 Attempt login: " + request.email);

        try {
            User user = em.createQuery(
                            "SELECT u FROM User u WHERE u.email = :email", User.class)
                    .setParameter("email", request.email)
                    .getSingleResult();

            if (!user.getPassword().equals(request.password)) {
                System.out.println("❌ Invalid password for: " + request.email);
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity(new ErrorResponse("Invalid credentials"))
                        .build();
            }

            String token = JwtUtil.generateToken(user.getEmail(), user.getRole(), user.getName());

            System.out.println("✅ Login success: " + request.email);
            return Response.ok(new LoginResponse(token)).build();

        } catch (NoResultException e) {
            System.out.println("❌ User not found: " + request.email);
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ErrorResponse("User not found"))
                    .build();
        }
    }
    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class LoginResponse {
        public String token;

        public LoginResponse(String token) {
            this.token = token;
        }
    }

    public static class ErrorResponse {
        public String error;

        public ErrorResponse(String error) {
            this.error = error;
        }
    }
}
