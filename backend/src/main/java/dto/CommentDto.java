package dto;

import Forum.PostEntity;
import model.CommentEntity;

import java.time.LocalDateTime;

public record CommentDto(
        String id,
        String authorName,
        String authorEmail,
        String message,
        LocalDateTime createdAt
) {
    public static CommentDto fromEntity(CommentEntity e) {
        return new CommentDto(
                e.getId(),
                e.getAuthorName(),
                e.getAuthorEmail(),
                e.getMessage(),
                e.getCreatedAt()
        );
    }

    public CommentEntity toEntity(PostEntity post) {
        CommentEntity c = new CommentEntity();
        c.setPost(post);
        c.setAuthorName(authorName);
        c.setAuthorEmail(authorEmail);
        c.setMessage(message);
        return c;
    }
}
