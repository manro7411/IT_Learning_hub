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

@Path("/teams")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TeamResource {

    @Inject
    EntityManager em;

    @GET
    public List<TeamEntity> getTeams() {
        return em.createQuery("SELECT t FROM TeamEntity t", TeamEntity.class).getResultList();
    }

    @GET
    @Path("/{id}")
    public TeamEntity getTeam(@PathParam("id") String id) {
        TeamEntity team = em.find(TeamEntity.class, id);
        if (team == null) {
            throw new WebApplicationException("Team not found", 404);
        }
        return team;
    }

    @POST
    @Transactional
    public Response createTeam(CreateTeamRequest request) {
        if (request.name == null || request.name.trim().isEmpty()) {
            throw new WebApplicationException("Team name is required", 400);
        }

        // สร้าง TeamEntity
        TeamEntity team = new TeamEntity();
        team.setId(UUID.randomUUID().toString().replace("-", "").substring(0, 21));
        team.setName(request.name);
        team.setDescription(request.description);
        team.setCreateBy(request.createBy);

        // Map สมาชิกจาก DTO → Entity
        List<MemberEntity> members = request.members.stream().map(dto -> {
            MemberEntity member = new MemberEntity();
            member.setId(UUID.randomUUID().toString().replace("-", "").substring(0, 21));
            member.setUserEmail(dto.userId);
            member.setNameMenbers(dto.userName);
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
}
