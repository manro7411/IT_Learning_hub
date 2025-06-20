package model;
import jakarta.persistence.*;
import org.mindrot.jbcrypt.BCrypt;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(length = 21) // NanoId length
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false, length = 60) // BCrypt hash length
    private String password;

    @Column(nullable = false)
    private String role = "employee";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime created;

    @PrePersist
    private void onCreate() {
        this.created = LocalDateTime.now();
        if (password != null && !password.startsWith("$2a$")) {
            this.password = BCrypt.hashpw(password, BCrypt.gensalt());
        }
    }

    @PreUpdate
    private void onUpdate() {
        if (password != null && !password.startsWith("$2a$")) {
            this.password = BCrypt.hashpw(password, BCrypt.gensalt());
        }
    }

    public String getId()               { return id; }
    public String getName()             { return name; }
    public String getEmail()            { return email; }
    public String getPassword()         { return password; }
    public String getRole()             { return role; }
    public LocalDateTime getCreated()   { return created; }

    public void setId(String id)                   { this.id = id; }
    public void setName(String name)               { this.name = name; }
    public void setEmail(String email)             { this.email = email; }
    public void setPassword(String password)       { this.password = password; }
    public void setRole(String role)               { this.role = role; }
    public void setCreated(LocalDateTime created)  { this.created = created; }
    public boolean passwordMatches(String rawPassword) {
        return BCrypt.checkpw(rawPassword, this.password);
    }
}
