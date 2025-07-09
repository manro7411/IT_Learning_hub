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

        return new ProfileDto(user.getId().toString(), user.getName(), user.getEmail());
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

        if (dto.name != null && !dto.name.isBlank()) user.setName(dto.name);
        if (dto.email != null && !dto.email.isBlank()) user.setEmail(dto.email);
        if (dto.password != null && !dto.password.isBlank()) {
            String hashed = BCrypt.hashpw(dto.password, BCrypt.gensalt(12));
            user.setPassword(hashed);
        }

        return new ProfileDto(user.getId().toString(), user.getName(), user.getEmail());
    }

    @GET
    @Path("/users")
    @RolesAllowed({"admin"})
    public List<ProfileDto> getAllUsers() {
        return em.createQuery("SELECT u FROM User u", User.class)
                .getResultList()
                .stream()
                .map(u -> new ProfileDto(u.getId().toString(), u.getName(), u.getEmail()))
                .toList();
    }

    @GET
    @Path("/users/for-supervisor")
    @RolesAllowed("supervisor")
    public List<UserWithRoleDto> getUsersForSupervisor() {
        return em.createQuery("SELECT u FROM User u WHERE u.role <> 'Supervisor'", User.class)
                .getResultList()
                .stream()
                .map(u -> new UserWithRoleDto(
                        u.getId().toString(),
                        u.getName(),
                        u.getEmail(),
                        u.getRole()
                ))
                .toList();
    }

    @PUT
    @Path("/users/{id}/role")
    @Transactional
    @RolesAllowed({ "supervisor" })
    public String updateUserRole(@PathParam("id") String userId, RoleUpdateDto dto) {
        try {
            System.out.println("Updating role for userId=" + userId + ", new role=" + dto.getRole());
            User user = em.find(User.class, userId);
            if (user == null) {
                throw new NotFoundException("User not found");
            }

            if (!isValidRole(dto.getRole())) {
                throw new BadRequestException("Invalid role specified");
            }

            user.setRole(dto.getRole());
            return "Role of user " + user.getName() + " updated to " + dto.getRole();

        } catch (Exception e) {
            e.printStackTrace();
            throw new InternalServerErrorException("Error updating user role: " + e.getMessage());
        }
    }

    private boolean isValidRole(String role) {
        return List.of("user", "employee", "admin", "supervisor")
                .stream()
                .anyMatch(r -> r.equalsIgnoreCase(role));
    }

    public static class UserWithRoleDto {
        public String id;
        public String name;
        public String email;
        public String role;

        public UserWithRoleDto() {} // สำหรับ deserialization
        public UserWithRoleDto(String id, String name, String email, String role) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }
    }

    public static class RoleUpdateDto {
        public String role;

        public RoleUpdateDto() {}
        public RoleUpdateDto(String role) {
            this.role = role;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    public static class UpdateDto {
        public String name;
        public String email;
        public String password;

        public UpdateDto() {}
    }
}
