package model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chat_log")
public class ChatLog {
    @Id
    private String id;

    private String userEmail;

    @Column(length = 1000)
    private String inputMessage;

    @Column(length = 2000)
    private String responseMessage;

    private boolean blocked;

    private LocalDateTime timestamp;

    @PrePersist
    public void generateIdAndTimestamp() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }

    // === Getters / Setters ===
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getInputMessage() { return inputMessage; }
    public void setInputMessage(String inputMessage) { this.inputMessage = inputMessage; }

    public String getResponseMessage() { return responseMessage; }
    public void setResponseMessage(String responseMessage) { this.responseMessage = responseMessage; }

    public boolean isBlocked() { return blocked; }
    public void setBlocked(boolean blocked) { this.blocked = blocked; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
