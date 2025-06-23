package model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Notification {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false)
    private String message;

    @Column(name = "read_status", nullable = false)
    private boolean read = false;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;


    public String getId()                 { return id; }
    public void   setId(String id)        { this.id = id; }

    public String getMessage()            { return message; }
    public void   setMessage(String m)    { this.message = m; }

    public boolean isRead()               { return read; }
    public void   setRead(boolean r)      { this.read = r; }

    public LocalDateTime getCreatedAt()   { return createdAt; }
    public void   setCreatedAt(LocalDateTime t){ this.createdAt = t; }

    public User   getRecipient()          { return recipient; }
    public void   setRecipient(User r)    { this.recipient = r; }
}
