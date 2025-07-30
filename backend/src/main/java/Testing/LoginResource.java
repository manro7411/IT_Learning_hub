package Testing;

import io.smallrye.common.annotation.RunOnVirtualThread;
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
import org.mindrot.jbcrypt.BCrypt;  // ✅ เพิ่ม import

import java.time.Duration;
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
            UUID accessUUID = UUID.randomUUID();
            UUID refreshUUID = UUID.randomUUID();

            String accessToken = JwtUtil.generateAccessToken(user.getEmail(),user.getRole(),user.getName(),accessUUID);
            String refreshToken = JwtUtil.generateRefreshToken(user.getEmail(),refreshUUID);

            NewCookie accessCookie = new NewCookie("access_token", accessToken,"/",null,"access-token",15*60,true,true);
            NewCookie refreshCookie = new NewCookie("refresh_token",refreshToken,"/",null,"refresh-token",7*24*60*60,true,true);

            LoginResponse loginResponse = new LoginResponse(user.getEmail(), user.getName(), user.getRole());

            System.out.println("✅ Login success: " + request.email);
            return Response.ok(loginResponse).cookie(accessCookie).cookie(refreshCookie).build();

        } catch (NoResultException e) {
            System.out.println("❌ User not found: " + request.email);
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ErrorResponse("User not found"))
                    .build();
        }
    }

    @POST
    @Path("/clear")
    public Response logout() {
        NewCookie expiredAccess = new NewCookie("access_token", "", "/", null, "access-token", 0, true, true);
        NewCookie expiredRefresh = new NewCookie("refresh_token", "", "/", null, "refresh-token", 0, true, true);

        return Response.ok().cookie(expiredAccess).cookie(expiredRefresh).build();
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class LoginResponse {
        public String email;
        public String name;
        public String role;

        public LoginResponse(String email, String name, String role) {
            this.email = email;
            this.name = name;
            this.role = role;
        }
    }

    public static class ErrorResponse {
        public String error;

        public ErrorResponse(String error) {
            this.error = error;
        }
    }
}
