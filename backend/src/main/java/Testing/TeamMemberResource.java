package Testing;

import dto.CreateMemberRequest;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.MemberEntity;
import model.TeamEntity;

import java.util.List;
import java.util.UUID;

@Path("/teams/{teamId}/members")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TeamMemberResource {

    @Inject
    EntityManager em;

    @GET
    public List<MemberEntity> listMembers(@PathParam("teamId") String teamId) {
        return em.createQuery("""
            SELECT m FROM MemberEntity m
            WHERE m.team.id = :teamId
        """, MemberEntity.class)
                .setParameter("teamId", teamId)
                .getResultList();
    }

    @POST
    @Transactional
    public Response addMember(@PathParam("teamId") String teamId, CreateMemberRequest request) {
        TeamEntity team = em.find(TeamEntity.class, teamId);
        if (team == null) {
            throw new WebApplicationException("Team not found", 404);
        }

        MemberEntity member = new MemberEntity();
        member.setId(UUID.randomUUID().toString().replace("-", "").substring(0, 21));
        member.setTeam(team);
        member.setUserEmail(request.userId);
        member.setNameMenbers(request.userName != null ? request.userName : "Unknown");
        member.setRole(request.role != null ? request.role : "member");

        em.persist(member);
        return Response.ok(member).build();
    }

    @DELETE
    @Path("/{memberId}")
    @Transactional
    public void deleteMember(@PathParam("teamId") String teamId, @PathParam("memberId") String memberId) {
        MemberEntity member = em.find(MemberEntity.class, memberId);
        if (member != null && member.getTeam().getId().equals(teamId)) {
            em.remove(member);
        } else {
            throw new WebApplicationException("Member not found", 404);
        }
    }
}
