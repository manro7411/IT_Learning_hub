package model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false)
    private String message;

    @Column(name = "read_status", nullable = false)
    private boolean read = false;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(
            name            = "recipient_id",
            nullable        = false,
            columnDefinition = "varchar(21)"
    )
    private User recipient;

    @Column(name="Target_users",nullable = true)
    private String target;

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public String getId()                   { return id != null ? id.toString() : null; }
    public void   setId(UUID id)            { this.id = id; }

    public String getMessage()              { return message; }
    public void   setMessage(String m)      { this.message = m; }

    public boolean isRead()                 { return read; }
    public void   setRead(boolean r)        { this.read = r; }

    public LocalDateTime getCreatedAt()     { return createdAt; }
    public void   setCreatedAt(LocalDateTime t) { this.createdAt = t; }

    public User   getRecipient()            { return recipient; }
    public void   setRecipient(User r)      { this.recipient = r; }
}
