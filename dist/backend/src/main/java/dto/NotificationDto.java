package dto;
import model.Notification;
import java.time.LocalDateTime;
public class NotificationDto {

    public String        id;
    public String        message;
    public LocalDateTime createdAt;
    public boolean       read;
    public String recipientName;
    public String targetName;

    public static NotificationDto fromEntity(Notification n) {
        if (n == null) return null;

        NotificationDto dto = new NotificationDto();
        dto.id        = n.getId();
        dto.message   = n.getMessage();
        dto.createdAt = n.getCreatedAt();
        dto.read      = n.isRead();
        dto.recipientName = n.getRecipient().getName();
        dto.targetName = n.getTarget();
        return dto;
    }
}