package Testing;

import dto.ProfileDto;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import model.User;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.mindrot.jbcrypt.BCrypt;

import java.util.List;

@Path("/profile")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProfileResource {
    @Inject EntityManager em;
    @Inject JsonWebToken jwt;

    @GET
    @RolesAllowed({ "user", "employee", "admin" })
    public ProfileDto getMe() {
        String email = jwt.getClaim("email");

        User user = em.createQuery(
                        "SELECT u FROM User u WHERE u.email = :email", User.class)
                .setParameter("email", email)
                .getSingleResult();

        return new ProfileDto(user.getName(), user.getEmail(), null);
    }

    @PUT
    @Transactional
    @RolesAllowed({ "user", "employee", "admin" })
    public ProfileDto updateMe(UpdateDto dto) {
        String email = jwt.getClaim("email");

        User user = em.createQuery(
                        "SELECT u FROM User u WHERE u.email = :email", User.class)
                .setParameter("email", email)
                .getSingleResult();

        if (dto.name != null && !dto.name.isBlank()) {
            user.setName(dto.name);
        }

        if (dto.email != null && !dto.email.isBlank()) {
            user.setEmail(dto.email);
        }

        if (dto.password != null && !dto.password.isBlank()) {
            String hashed = BCrypt.hashpw(dto.password, BCrypt.gensalt(12));
            user.setPassword(hashed);
        }

        return new ProfileDto(user.getName(), user.getEmail(), null);
    }

    @GET
    @Path("/users")
    @RolesAllowed("admin")
    public List<ProfileDto> getAllUsers() {
        return em.createQuery("SELECT u FROM User u", User.class)
                .getResultList()
                .stream()
                .map(u -> new ProfileDto(u.getName(), u.getEmail(), null))
                .toList();
    }

    public static class UpdateDto {
        public String name;
        public String email;
        public String password;
    }
}
