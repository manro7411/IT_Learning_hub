package Testing;

import jakarta.annotation.security.PermitAll;
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

import org.eclipse.microprofile.jwt.JsonWebToken;
import io.smallrye.jwt.auth.principal.JWTParser;

import java.util.UUID;

@Path("/login")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LoginResource {

    @Inject EntityManager em;
    @Inject JWTParser jwtParser;

    // อายุคุกกี้ (วินาที)
    private static final int ACCESS_MAX_AGE  = 2 * 60 * 60;        // 2 ชั่วโมง
    private static final int REFRESH_MAX_AGE = 7 * 24 * 60 * 60;   // 7 วัน

    // ตั้งค่าให้ใช้ Secure=true เสมอ (ถ้า dev บน http://localhost แล้วคุกกี้ไม่ขึ้น

    private static final boolean SECURE   = true;   // ใช้ HTTPS จริงให้ true
    private static final boolean HTTPONLY = true;

    private NewCookie accessCookie(String jwt) {
        return new NewCookie("jwt", jwt, "/", null, "", ACCESS_MAX_AGE, SECURE, HTTPONLY);
    }
    private NewCookie refreshCookie(String refresh) {
        return new NewCookie("refresh", refresh, "/", null, "", REFRESH_MAX_AGE, SECURE, HTTPONLY);
    }

    private NewCookie uuidCookie(UUID uuid) {
        return new NewCookie("sid", uuid.toString(), "/", null, "session id", REFRESH_MAX_AGE, SECURE, false);
    }

    private NewCookie deleteCookie(String name, boolean httpOnly) {
        return new NewCookie(name, "", "/", null, "", 0, SECURE, httpOnly);
    }

    // ดึง exp จาก JWT (epoch seconds)
    private Long expFrom(String jwt) {
        try { return (Long) jwtParser.parse(jwt).getClaim("exp"); }
        catch (Exception e) { return null; }
    }

    // ==== DTOs ====
    public static class LoginRequest { public String email; public String password; }
    public static class RoleResponse { public String role; public RoleResponse(String role){ this.role = role; } }
    public static class ErrorResponse { public String error; public ErrorResponse(String error){ this.error = error; } }
    public static class SessionInfo {
        public String role;
        public Long accessExp;
        public Long refreshExp;
        public String sid; // uuid ที่ใส่ในคุกกี้ sid
        public SessionInfo(String role, Long accessExp, Long refreshExp, String sid) {
            this.role = role; this.accessExp = accessExp; this.refreshExp = refreshExp; this.sid = sid;
        }
    }

    @POST
    @Transactional
    public Response login(LoginRequest request) {
        try {
            User user = em.createQuery(
                            "SELECT u FROM User u WHERE u.email = :email", User.class)
                    .setParameter("email", request.email)
                    .getSingleResult();

            if (!BCrypt.checkpw(request.password, user.getPassword())) {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity(new ErrorResponse("Invalid credentials")).build();
            }

            UUID uuid = UUID.randomUUID();
            String access  = JwtUtil.generateToken(user.getEmail(), user.getRole(), user.getName(), uuid);
            String refresh = JwtUtil.refreshToken (user.getEmail(), user.getRole(), user.getName(), uuid);

            Long accessExp  = expFrom(access);
            Long refreshExp = expFrom(refresh);

            return Response.ok(new SessionInfo(user.getRole(), accessExp, refreshExp, uuid.toString()))
                    .cookie(accessCookie(access))
                    .cookie(refreshCookie(refresh))
                    .cookie(uuidCookie(uuid))
                    .build();

        } catch (NoResultException e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ErrorResponse("User not found")).build();
        }
    }

    @POST
    @Path("/logout")
    @PermitAll
    public Response logout() {
        return Response.ok(new Message("logged out"))
                .cookie(deleteCookie("jwt", true))
                .cookie(deleteCookie("refresh", true))
                .cookie(deleteCookie("sid", false))
                .build();
    }
    public static class Message { public String message; public Message(String m){ this.message = m; } }

    @POST
    @Path("/refresh")
    @PermitAll
    @Transactional(Transactional.TxType.SUPPORTS)
    public Response refresh(@CookieParam("refresh") String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ErrorResponse("Missing refresh token")).build();
        }

        try {
            JsonWebToken rt = jwtParser.parse(refreshToken);

            String email = str(rt.getClaim("email"));
            if (email == null || email.isBlank()) email = rt.getName();
            String name  = str(rt.getClaim("name"));
            String role  = str(rt.getClaim("role"));

            String uuidStr = str(rt.getClaim("UUID"));
            UUID uuid = uuidStr != null ? UUID.fromString(uuidStr) : UUID.randomUUID();

            String newAccess  = JwtUtil.generateToken(email, role, name, uuid);
            String newRefresh = JwtUtil.refreshToken(email, role, name, uuid);

            Long accessExp  = expFrom(newAccess);
            Long refreshExp = expFrom(newRefresh);


            return Response.ok(new SessionInfo(role, accessExp, refreshExp, uuid.toString()))
                    .cookie(accessCookie(newAccess))
                    .cookie(refreshCookie(newRefresh))
                    .cookie(uuidCookie(uuid))
                    .build();

        } catch (Exception e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ErrorResponse("Invalid refresh token")).build();
        }
    }

    @GET
    @Path("/session")
    @PermitAll
    public Response session(@CookieParam("jwt") String access,
                            @CookieParam("refresh") String refresh,
                            @CookieParam("sid") String sid) {
        Long accessExp  = access  != null && !access.isBlank()  ? expFrom(access)  : null;
        Long refreshExp = refresh != null && !refresh.isBlank() ? expFrom(refresh) : null;
        return Response.ok(new SessionInfo(null, accessExp, refreshExp, sid)).build();
    }

    private static String str(Object v) { return v == null ? null : v.toString(); }
}
