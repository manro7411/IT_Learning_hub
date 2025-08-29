package model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Entity
@Table(name = "teams")
@JsonIgnoreProperties("memberEntities")
public class TeamEntity {

    @Id
    @Column(length = 21)
    private String id;

    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "create_by" , length = 255)
    private String createBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createTime;

    @Column(name = "join_code", unique = true, length = 6)
    private String joinCode;

    @OneToMany(mappedBy = "team",fetch = FetchType.EAGER,cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MemberEntity> memberEntities;
    @PrePersist
    public void generateId() {
        if (id == null || id.isEmpty()) {
            this.id = UUID.randomUUID().toString().replace("-", "").substring(0, 21);
        }
        if (createTime == null) {
            this.createTime = LocalDateTime.now();
        }
        if (joinCode == null || joinCode.isEmpty()) {
            this.joinCode = generateRandomCode(6);
        }
    }

    private String generateRandomCode(int length) {
        int min = (int) Math.pow(10, length - 1);
        int max = (int) Math.pow(10, length) - 1;
        return String.valueOf(ThreadLocalRandom.current().nextInt(min, max + 1));
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCreateBy() { return createBy; }
    public void setCreateBy(String createBy) { this.createBy = createBy; }

    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }

    public String getJoinCode() { return joinCode; }
    public void setJoinCode(String joinCode) { this.joinCode = joinCode; }

    public List<String> getMembers() {
        return memberEntities.stream()
                .map(MemberEntity::getUserEmail)
                .collect(Collectors.toList());
    }

    public void setMembers(List<String> memberEmails) {
        this.memberEntities = memberEmails.stream().map(email -> {
            MemberEntity m = new MemberEntity();
            m.setUserEmail(email);
            m.setTeam(this);
            m.setRole("member"); // default role
            return m;
        }).collect(Collectors.toList());
    }

    public List<MemberEntity> getMemberEntities() { return memberEntities; }
    public void setMemberEntities(List<MemberEntity> memberEntities) { this.memberEntities = memberEntities; }
}
