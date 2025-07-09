package Testing;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.User;
import org.mindrot.jbcrypt.BCrypt;

import java.time.LocalDateTime;
import java.util.Set;

@Path("/register")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class RegisterResource {

    private static final Set<String> ALLOWED_ROLES = Set.of("user", "admin","supervisor");

    @Inject
    EntityManager em;
    public static class RegisterDto {
        public String name;
        public String email;
        public String password;
        public String role;          // optional ("user" by default)
    }

    @POST
    @Transactional
    public Response register(RegisterDto dto) {

        if (dto.name == null || dto.email == null || dto.password == null) {
            throw new BadRequestException("Missing fields (name, email, password)");
        }

        String role = (dto.role == null || dto.role.isBlank())
                ? "user"
                : dto.role.toLowerCase();

        if (!ALLOWED_ROLES.contains(role)) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorMsg("Invalid role. Allowed: user | admin"))
                    .build();
        }


        boolean exists = em.createQuery(
                        "SELECT count(u) FROM User u WHERE u.email = :email",
                        Long.class)
                .setParameter("email", dto.email)
                .getSingleResult() > 0;

        if (exists) {
            return Response.status(Response.Status.CONFLICT)
                    .entity(new ErrorMsg("Email already registered"))
                    .build();
        }


        User user = new User();
        user.setId(NanoIdUtils.randomNanoId());
        user.setName(dto.name);
        user.setEmail(dto.email);
        user.setPassword(BCrypt.hashpw(dto.password, BCrypt.gensalt(12)));
        user.setRole(role);
        user.setCreated(LocalDateTime.now());

        em.persist(user);

        return Response.status(Response.Status.CREATED)
                .entity(new SuccessMsg("User created", user.getId(), user.getRole()))
                .build();
    }

    record ErrorMsg(String error) {}
    record SuccessMsg(String message, String id, String role) {}
}
