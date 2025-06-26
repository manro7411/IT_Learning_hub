package dto;

import Forum.PostEntity;
import model.CommentEntity;

import java.time.LocalDateTime;

public record CommentDto(
        String id,
        String postId,
        String authorName,
        String authorEmail,
        String message,
        LocalDateTime createdAt
) {
    /* ─── Mapping helpers ─── */
    public static CommentDto fromEntity(CommentEntity e) {
        return new CommentDto(
                e.getId(),
                e.getPost().getId(),
                e.getAuthorName(),
                e.getAuthorEmail(),
                e.getMessage(),
                e.getCreatedAt()
        );
    }

    public CommentEntity toEntity(PostEntity post) {
        CommentEntity e = new CommentEntity();
        e.setPost(post);
        e.setAuthorName(authorName);
        e.setAuthorEmail(authorEmail);
        e.setMessage(message);
        return e;
    }
}
