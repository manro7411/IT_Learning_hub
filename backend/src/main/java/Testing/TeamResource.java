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
import java.util.Random;
import java.util.UUID;

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
    @GET
    @Path("/my-teams/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<TeamEntity> getTeamsByUserId(@PathParam("userId") String userId) {
        return em.createQuery(
                        "SELECT m.team FROM MemberEntity m WHERE m.userID = :userId", TeamEntity.class)
                .setParameter("userId", userId)
                .getResultList();
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
        team.setJoinCode(String.format("%06d", new Random().nextInt(1_000_000)));

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

      if (request == null || request.joinCode.trim().length() != 6) {
          System.out.println("Join code is invalid");
          throw new WebApplicationException(Response.Status.BAD_REQUEST);

      }
        List<TeamEntity> teams = em.createQuery(
                        "SELECT t FROM TeamEntity t WHERE t.joinCode = :joinCode", TeamEntity.class)
                .setParameter("joinCode", request.joinCode)
                .getResultList();

      if (teams == null || teams.isEmpty()) {
          System.out.println("Join code is invalid");
          throw new WebApplicationException(Response.Status.BAD_REQUEST);
      }

      TeamEntity team = teams.getFirst();
      boolean alreadyExists = team.getMemberEntities().stream() .anyMatch(member -> member.getUserEmail().equalsIgnoreCase(request.userId));

      if (alreadyExists) {
          System.out.println("Team already exists");
          throw new WebApplicationException("User already in the team", 409);
      }

        System.out.println("Backend receiving code : "+request.joinCode);
        System.out.println("Joined teams: " + teams);
        System.out.println("Join code : "+request.getJoinCode()+" UserID : "+request.getUserId()+" Username : "+request.getUserName()+" Role " +request.getRole());
        System.out.println("Team ID: "+team);

        MemberEntity member = new MemberEntity();
        member.setId(UUID.randomUUID().toString().replace("-", "").substring(0, 21));
        member.setTeam(team);
        member.setUserEmail(request.userId);
        member.setRole("member");
        member.setNameMembers(request.userName);
        team.getMemberEntities().add(member);
        em.persist(member);

        return Response.ok().entity("Joined team successfully!").build();
    }
}
