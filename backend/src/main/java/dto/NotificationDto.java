package dto;
import model.Notification;
import java.time.LocalDateTime;
public class NotificationDto {

    public String        id;
    public String        message;
    public LocalDateTime createdAt;
    public boolean       read;

    public static NotificationDto fromEntity(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.id        = n.getId();
        dto.message   = n.getMessage();
        dto.createdAt = n.getCreatedAt();
        dto.read      = n.isRead();
        return dto;
    }
}
