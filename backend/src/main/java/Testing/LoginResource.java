package Testing;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;
import model.User;
import util.JwtUtil;
import org.mindrot.jbcrypt.BCrypt;

import java.util.UUID;

@Path("/login")
//@RunOnVirtualThread
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

            if (!BCrypt.checkpw(request.password, user.getPassword())) {
                System.out.println("❌ Invalid password for: " + request.email);
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity(new ErrorResponse("Invalid credentials"))
                        .build();
            }
            UUID uuid = UUID.randomUUID();

            String token = JwtUtil.generateToken(user.getEmail(), user.getRole(), user.getName(),uuid);
            String refreshToken = JwtUtil.refreshToken(user.getEmail(), user.getRole(), user.getName(),uuid);


            NewCookie accessCookie = new NewCookie("jwt", token, "/", null, "JWT access token", 2 * 60 * 60, true, true);
            NewCookie refreshCookie = new NewCookie("refresh", token, "/", null, "JWT access token", 2 * 60 * 60, true, true);

            System.out.println("✅ Login success: " + request.email);

            return Response.ok(new RoleResponse(user.getRole())).cookie(accessCookie).cookie(refreshCookie).build();

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

    public static class RoleResponse {
        public String role;
        public RoleResponse(String role) {
            this.role = role;
        }
    }

    public static class LoginResponse {
        public String token;
        public String refreshToken;

        public LoginResponse(String token, String refreshToken) {
            this.token = token;this.refreshToken = refreshToken;
        }
    }


    public static class ErrorResponse {
        public String error;

        public ErrorResponse(String error) {
            this.error = error;
        }
    }
}