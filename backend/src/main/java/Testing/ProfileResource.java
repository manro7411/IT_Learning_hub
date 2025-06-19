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

@Path("/profile")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProfileResource {

    @Inject EntityManager em;
    @Inject JsonWebToken  jwt;

    /* ---------- GET: current user ---------- */
    @GET
    @RolesAllowed({ "employee", "admin" })
    public ProfileDto getMe() {
        String email = jwt.getClaim("email");

        return em.createQuery(
                        "SELECT new dto.ProfileDto(u.name, u.email, u.password) " +
                                "FROM User u WHERE u.email = :email",
                        ProfileDto.class)
                .setParameter("email", email)
                .getSingleResult();
    }

    public static class UpdateDto {      // ⇦ payload จาก frontend
        public String name;
        public String email;
        public String password;
    }

    @PUT
    @Transactional
    @RolesAllowed({ "employee", "admin" })
    public ProfileDto updateMe(UpdateDto dto) {
        String email = jwt.getClaim("email");

        User user = em.createQuery(
                        "SELECT u FROM User u WHERE u.email = :email", User.class)
                .setParameter("email", email)
                .getSingleResult();

        if (dto.name      != null) user.setName(dto.name);
        if (dto.email     != null) user.setEmail(dto.email);
        if (dto.password  != null) user.setPassword(dto.password); // hash ใน prod

        return new ProfileDto(user.getName(), user.getEmail(), user.getPassword());
    }
}
