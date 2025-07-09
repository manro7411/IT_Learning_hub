package Testing;

import dto.CreateMemberRequest;
import dto.CreateTeamRequest;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.MemberEntity;
import model.TeamEntity;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import static io.quarkus.arc.ComponentsProvider.LOG;

@Path("/teams")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TeamResource {

    @Inject
    EntityManager em;

    @GET
    public List<TeamEntity> getTeams() {
        return em.createQuery("SELECT t FROM TeamEntity t", TeamEntity.class)
                .getResultList();
    }

    @GET
    @Path("/{id}")
    public TeamEntity getTeam(@PathParam("id") String id) {
        TeamEntity team = em.find(TeamEntity.class, id);
        if (team == null) {
            throw new NotFoundException("Team not found");
        }
        return team;
    }

    @POST
    @Transactional
    public Response createTeam(CreateTeamRequest request) {
        if (request.name == null || request.name.trim().isEmpty()) {
            throw new BadRequestException("Team name is required");
        }

        TeamEntity team = new TeamEntity();
        team.setId(UUID.randomUUID().toString().replace("-", "").substring(0, 21));
        team.setName(request.name);
        team.setDescription(request.description);
        team.setCreateBy(request.createBy);
        // ✅ สร้าง joinCode
        team.setJoinCode(UUID.randomUUID().toString().replace("-", "").substring(0, 8));

        // ✅ สร้าง members
        List<MemberEntity> members = request.members.stream().map(dto -> {
            MemberEntity member = new MemberEntity();
            member.setId(UUID.randomUUID().toString().replace("-", "").substring(0, 21));
            member.setUserEmail(dto.userId);
            member.setNameMembers(dto.userName);  // แก้ชื่อฟิลด์
            member.setRole("member");
            member.setTeam(team);
            return member;
        }).toList();

        team.setMemberEntities(members);
        em.persist(team);

        return Response.created(URI.create("/teams/" + team.getId()))
                .entity(team)
                .build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateTeam(@PathParam("id") String id, TeamEntity updatedTeam) {
        TeamEntity team = em.find(TeamEntity.class, id);
        if (team == null) throw new NotFoundException("Team not found");

        if (updatedTeam.getName() != null) {
            team.setName(updatedTeam.getName());
        }
        if (updatedTeam.getDescription() != null) {
            team.setDescription(updatedTeam.getDescription());
        }

        return Response.ok(team).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteTeam(@PathParam("id") String id) {
        TeamEntity team = em.find(TeamEntity.class, id);
        if (team == null) throw new NotFoundException("Team not found");
        em.remove(team);
        return Response.noContent().build();
    }

    @POST
    @Path("/joining")
    @Transactional
    public Response joinTeamByCode(CreateMemberRequest request) {
        if (request.joinCode == null || request.userId == null || request.userName == null) {
            throw new BadRequestException("Join code, user id, and user name are required");
        }

        List<TeamEntity> teams = em.createQuery(
                        "SELECT t FROM TeamEntity t WHERE t.joinCode = :joinCode", TeamEntity.class)
                .setParameter("joinCode", request.joinCode)
                .getResultList();

        if (teams.isEmpty()) {
            throw new NotFoundException("Team not found with join code");
        }

        TeamEntity team = teams.get(0);

        LOG.infof("✅ Found team: id=%s, name=%s", team.getId(), team.getName());

        boolean alreadyExists = team.getMemberEntities().stream()
                .anyMatch(member -> member.getUserEmail().equals(request.userId));

        if (alreadyExists) {
            throw new ClientErrorException("User already joined this team", 409);
        }

        MemberEntity member = new MemberEntity();
        member.setId(UUID.randomUUID().toString().replace("-", "").substring(0, 21));
        member.setUserEmail(request.userId);
        member.setNameMembers(request.userName);
        member.setRole("member");
        member.setTeam(team);

        em.persist(member);
        team.getMemberEntities().add(member);

        return Response.ok().entity("Joined team successfully!").build();
    }
}
