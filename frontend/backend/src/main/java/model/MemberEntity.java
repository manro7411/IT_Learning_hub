package model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "team_members")
public class MemberEntity {

    @Id
    @Column(length = 21)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private TeamEntity team;

    @Column(name = "name_menbers")
    private String nameMembers;

    @Column(name = "member_ID", nullable = false)
    private String userID;

    @Column(name = "role", nullable = false)
    private String role;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    @PrePersist
    public void generateId() {
        if (id == null || id.isEmpty()) {
            this.id = UUID.randomUUID().toString().replace("-", "").substring(0, 21);
        }
        if (joinedAt == null) {
            this.joinedAt = LocalDateTime.now();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public TeamEntity getTeam() { return team; }
    public void setTeam(TeamEntity team) { this.team = team; }

    public String getUserEmail() { return userID; }
    public void setUserEmail(String userEmail) { this.userID = userEmail; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }

    public String getNameMembers() {
        return nameMembers;
    }

    public void setNameMembers(String nameMembers) {
        this.nameMembers = nameMembers;
    }
}
